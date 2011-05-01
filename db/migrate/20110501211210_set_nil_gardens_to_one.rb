class SetNilGardensToOne < ActiveRecord::Migration
  def self.up
  	Plant.find(:all).each { |plant| plant.garden_id = 1 if plant.garden_id.nil? }
  end

  def self.down
  end
end
