class AddShapeToAnnot < ActiveRecord::Migration
  def self.up
    add_column :annots, :shape, :string
  end

  def self.down
    remove_column :annots, :shape
  end
end
