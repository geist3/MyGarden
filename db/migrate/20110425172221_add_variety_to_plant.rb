class AddVarietyToPlant < ActiveRecord::Migration
  def self.up
    add_column :plants, :variety, :string
  end

  def self.down
    remove_column :plants, :variety
  end
end
