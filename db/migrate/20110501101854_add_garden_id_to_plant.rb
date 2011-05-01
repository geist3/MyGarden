class AddGardenIdToPlant < ActiveRecord::Migration
  def self.up
    add_column :plants, :garden_id, :integer
  end

  def self.down
    remove_column :plants, :garden_id
  end
end
