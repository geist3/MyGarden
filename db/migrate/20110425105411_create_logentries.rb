class CreateLogentries < ActiveRecord::Migration
  def self.up
    create_table :logentries do |t|
      t.string :notes
      t.date :logdate
	  t.integer :plant_id
      t.timestamps
    end
  end

  def self.down
    drop_table :logentries
  end
end
