# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110501101854) do

  create_table "annots", :force => true do |t|
    t.string   "type"
    t.string   "props"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "shape"
  end

  create_table "gardens", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "notes"
  end

  create_table "logentries", :force => true do |t|
    t.string   "notes"
    t.date     "logdate"
    t.integer  "plant_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "plants", :force => true do |t|
    t.string   "name"
    t.string   "where"
    t.string   "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "variety"
    t.integer  "garden_id"
  end

  create_table "tasks", :force => true do |t|
    t.string   "short_description"
    t.date     "from"
    t.date     "to"
    t.string   "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "plant_id"
  end

end
