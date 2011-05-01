class Plant < ActiveRecord::Base
	has_many :logentries
	has_many :tasks
	belongs_to :garden
end
