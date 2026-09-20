import shutil
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
)
from sqlalchemy.orm import Session

from .session import get_current_user
from .database import get_db
from .git_models import GitProject


router = APIRouter(
    prefix="/api/git-impact",
    tags=["Git Impact"],
)


def require_current_user(
    request: Request,
    db: Session = Depends(get_db),
):
    user = get_current_user(
        request,
        db,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required.",
        )

    return user


@router.post("/setup")
async def setup_git_project(
    repo_owner: str = Form(...),
    repo_name: str = Form(...),
    installation_id: str = Form(...),
    default_budget: int = Form(...),
    catalog: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_current_user),
):
    if default_budget <= 0:
        raise HTTPException(
            status_code=400,
            detail="Default budget must be greater than 0.",
        )

    if not catalog.filename.lower().endswith(
        (".csv", ".xlsx")
    ):
        raise HTTPException(
            status_code=400,
            detail="Catalog must be a CSV or XLSX file.",
        )

    project_dir = Path(
        "data/git_projects"
    )

    project_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    filename = (
        f"{current_user.id}_"
        f"{repo_owner}_"
        f"{repo_name}_"
        f"{catalog.filename}"
    )

    catalog_path = (
        project_dir / filename
    )

    with catalog_path.open("wb") as file:
        shutil.copyfileobj(
            catalog.file,
            file,
        )

    project = GitProject(
        user_id=current_user.id,
        repo_owner=repo_owner,
        repo_name=repo_name,
        installation_id=installation_id,
        default_budget=default_budget,
        catalog_path=str(catalog_path),
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "message": (
            "Git Impact project "
            "created successfully."
        ),
        "project_id": project.id,
        "repository": (
            f"{repo_owner}/{repo_name}"
        ),
        "default_budget": default_budget,
    }


@router.get("/project")
def get_git_project(
    db: Session = Depends(get_db),
    current_user=Depends(require_current_user),
):
    project = (
        db.query(GitProject)
        .filter(
            GitProject.user_id
            == current_user.id
        )
        .first()
    )

    if not project:
        return {
            "configured": False,
        }

    return {
        "configured": True,
        "project_id": project.id,
        "repository": (
            f"{project.repo_owner}/"
            f"{project.repo_name}"
        ),
        "installation_id": (
            project.installation_id
        ),
        "default_budget": (
            project.default_budget
        ),
        "catalog_path": (
            project.catalog_path
        ),
    }