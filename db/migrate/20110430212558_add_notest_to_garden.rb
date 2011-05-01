class AddNotestToGarden < ActiveRecord::Migration
  def self.up
    add_column :gardens, :notes, :string
  end

  def self.down
    remove_column :gardens, :notes
  end
end
