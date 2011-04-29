class CreateAnnots < ActiveRecord::Migration
  def self.up
    create_table :annots do |t|
      t.string :type
      t.string :props

      t.timestamps
    end
  end

  def self.down
    drop_table :annots
  end
end
