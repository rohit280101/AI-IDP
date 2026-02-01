"""restore missing revision

Revision ID: aa9ce7d6c57f
Revises: 667354a1f324
Create Date: 2026-01-31 12:53:34.567994

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa9ce7d6c57f'
down_revision: Union[str, Sequence[str], None] = '667354a1f324'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
