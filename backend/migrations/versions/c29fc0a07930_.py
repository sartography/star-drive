"""empty message

Revision ID: c29fc0a07930
Revises: 62150b1fb708
Create Date: 2020-04-14 16:39:28.460452

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c29fc0a07930'
down_revision = '62150b1fb708'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('investigator', sa.Column('organization_name', sa.String(), nullable=True))
    op.add_column('resource', sa.Column('organization_name', sa.String(), nullable=True))
    op.add_column('study', sa.Column('organization_name', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('study', 'organization_name')
    op.drop_column('resource', 'organization_name')
    op.drop_column('investigator', 'organization_name')
    # ### end Alembic commands ###
