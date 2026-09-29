"""
Migration script to ensure:
1. regression_results contains priority, description, tags, and historical_failure_count columns.
2. regression_runs contains result_json column.
3. Backfills existing regression_results records with metadata from test catalog or score heuristics.
"""

from pathlib import Path
import pandas as pd
from sqlalchemy import text, inspect
from backend.database import engine


def run_migration():
    try:
        with engine.connect() as conn:
            insp = inspect(engine)
            existing_tables = insp.get_table_names()

            if "regression_results" not in existing_tables or "regression_runs" not in existing_tables:
                return

            res_cols = [c["name"] for c in insp.get_columns("regression_results")]

            if "priority" not in res_cols:
                conn.execute(text("ALTER TABLE regression_results ADD COLUMN priority VARCHAR(50) NULL;"))

            if "description" not in res_cols:
                conn.execute(text("ALTER TABLE regression_results ADD COLUMN description TEXT NULL;"))

            if "tags" not in res_cols:
                conn.execute(text("ALTER TABLE regression_results ADD COLUMN tags VARCHAR(255) NULL;"))

            if "historical_failure_count" not in res_cols:
                conn.execute(text("ALTER TABLE regression_results ADD COLUMN historical_failure_count INT NULL DEFAULT 0;"))

            run_cols = [c["name"] for c in insp.get_columns("regression_runs")]
            if "result_json" not in run_cols:
                conn.execute(text("ALTER TABLE regression_runs ADD COLUMN result_json LONGTEXT NULL;"))

            # Backfill from data/test_cases.csv if available
            catalog_csv = Path("data/test_cases.csv")
            if catalog_csv.exists():
                try:
                    df = pd.read_csv(catalog_csv)
                    for _, row in df.iterrows():
                        conn.execute(
                            text("""
                                UPDATE regression_results 
                                SET description = :desc, priority = :priority, tags = :tags, historical_failure_count = :hfc
                                WHERE test_id = :tid AND (description IS NULL OR priority IS NULL)
                            """),
                            {
                                "desc": str(row["description"]),
                                "priority": str(row["priority"]),
                                "tags": str(row.get("tags", "")),
                                "hfc": int(row.get("historical_failure_count", 0)),
                                "tid": str(row["test_id"]),
                            },
                        )
                except Exception as e:
                    print("Catalog backfill note:", e)

            # Fallbacks for any remaining NULLs
            conn.execute(text("""
                UPDATE regression_results
                SET priority = CASE 
                    WHEN priority_score >= 70 THEN 'High'
                    WHEN priority_score >= 40 THEN 'Medium'
                    ELSE 'Low'
                END
                WHERE priority IS NULL;
            """))

            conn.execute(text("""
                UPDATE regression_results
                SET description = CONCAT('Regression test ', test_id)
                WHERE description IS NULL OR description = '';
            """))

            conn.execute(text("""
                UPDATE regression_results
                SET historical_failure_count = 0
                WHERE historical_failure_count IS NULL;
            """))

            conn.commit()
    except Exception as err:
        print("Schema sync notice:", err)


if __name__ == "__main__":
    run_migration()
