"""empty message

Revision ID: fbcc182116ca
Revises: fd907adff7c3
Create Date: 2020-01-14 14:43:48.192752

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fbcc182116ca'
down_revision = 'fd907adff7c3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('stardrive_user', sa.Column('registration_date', sa.DateTime(timezone=True), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('stardrive_user', 'registration_date')
    # ### end Alembic commands ###
