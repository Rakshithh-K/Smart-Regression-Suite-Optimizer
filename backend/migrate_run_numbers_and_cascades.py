"""
Database migration script to:
1. Ensure run_number column exists on regression_runs.
2. Clean up orphaned regression_runs and regression_results where user_id does not exist in users.
3. Renumber existing runs sequentially (1, 2, 3...) per user based on creation order.
4. Add ON DELETE CASCADE foreign key constraints:
   - regression_runs(user_id) -> users(id) ON DELETE CASCADE
   - regression_results(run_id) -> regression_runs(id) ON DELETE CASCADE
"""

from sqlalchemy import text, inspect
from backend.database import engine

def run_migration():
    print("Starting migration...")
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            insp = inspect(engine)

            # 1. Ensure run_number column exists on regression_runs
            columns = [c["name"] for c in insp.get_columns("regression_runs")]
            if "run_number" not in columns:
                print("Adding run_number column to regression_runs...")
                conn.execute(text("ALTER TABLE regression_runs ADD COLUMN run_number INT NOT NULL DEFAULT 1;"))
            else:
                print("run_number column already exists on regression_runs.")

            # 2. Clean up orphaned regression_results and regression_runs
            print("Cleaning up orphaned regression results for nonexistent runs...")
            conn.execute(text("""
                DELETE FROM regression_results 
                WHERE run_id NOT IN (SELECT id FROM regression_runs);
            """))

            print("Cleaning up orphaned regression results for runs belonging to nonexistent users...")
            conn.execute(text("""
                DELETE FROM regression_results 
                WHERE run_id IN (
                    SELECT id FROM regression_runs 
                    WHERE user_id NOT IN (SELECT id FROM users)
                );
            """))

            print("Cleaning up orphaned regression runs for nonexistent users...")
            conn.execute(text("""
                DELETE FROM regression_runs 
                WHERE user_id NOT IN (SELECT id FROM users);
            """))

            # 3. Renumber existing runs per user sequentially by created_at, id
            print("Renumbering existing runs per user...")
            distinct_users = conn.execute(text("SELECT DISTINCT user_id FROM regression_runs")).fetchall()
            for (u_id,) in distinct_users:
                user_runs = conn.execute(text("""
                    SELECT id FROM regression_runs 
                    WHERE user_id = :u_id 
                    ORDER BY created_at ASC, id ASC
                """), {"u_id": u_id}).fetchall()

                for seq, (r_id,) in enumerate(user_runs, start=1):
                    conn.execute(text("""
                        UPDATE regression_runs 
                        SET run_number = :seq 
                        WHERE id = :r_id
                    """), {"seq": seq, "r_id": r_id})
                print(f"  User {u_id}: renumbered {len(user_runs)} runs.")

            # 4. Add foreign keys with ON DELETE CASCADE if not already present
            existing_fks_runs = insp.get_foreign_keys("regression_runs")
            has_user_fk = any(
                fk.get("referred_table") == "users" and 
                "user_id" in fk.get("constrained_columns", [])
                for fk in existing_fks_runs
            )
            if not has_user_fk:
                print("Adding foreign key fk_regression_runs_user_id (ON DELETE CASCADE)...")
                conn.execute(text("""
                    ALTER TABLE regression_runs 
                    ADD CONSTRAINT fk_regression_runs_user_id 
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
                """))
            else:
                print("Foreign key on regression_runs(user_id) already present.")

            existing_fks_results = insp.get_foreign_keys("regression_results")
            has_run_fk = any(
                fk.get("referred_table") == "regression_runs" and 
                "run_id" in fk.get("constrained_columns", [])
                for fk in existing_fks_results
            )
            if not has_run_fk:
                print("Adding foreign key fk_regression_results_run_id (ON DELETE CASCADE)...")
                conn.execute(text("""
                    ALTER TABLE regression_results 
                    ADD CONSTRAINT fk_regression_results_run_id 
                    FOREIGN KEY (run_id) REFERENCES regression_runs(id) ON DELETE CASCADE;
                """))
            else:
                print("Foreign key on regression_results(run_id) already present.")

            trans.commit()
            print("Migration completed successfully!")
        except Exception as e:
            trans.rollback()
            print("Migration failed:", e)
            raise

if __name__ == "__main__":
    run_migration()
