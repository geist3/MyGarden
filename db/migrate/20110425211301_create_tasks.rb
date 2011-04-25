class CreateTasks < ActiveRecord::Migration
  def self.up
    create_table :tasks do |t|
      t.string :short_description
      t.date :from
      t.date :to
      t.string :notes

      t.timestamps
    end
  end

  def self.down
    drop_table :tasks
  end
end
