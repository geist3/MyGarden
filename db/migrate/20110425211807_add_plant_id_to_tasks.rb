class AddPlantIdToTasks < ActiveRecord::Migration
  def self.up
    add_column :tasks, :plant_id, :integer
  end

  def self.down
    remove_column :tasks, :plant_id
  end
end
