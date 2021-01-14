"""empty message

Revision ID: 3f38dd4854a8
Revises: 3f74f9ece01b
Create Date: 2021-01-14 17:44:25.655553

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3f38dd4854a8'
down_revision = '3f74f9ece01b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('chain_session_step', sa.Column('reason_step_incomplete', sa.String(), nullable=True))
    op.drop_column('chain_session_step', 'challenging_behavior_severity')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('chain_session_step', sa.Column('challenging_behavior_severity', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('chain_session_step', 'reason_step_incomplete')
    # ### end Alembic commands ###
