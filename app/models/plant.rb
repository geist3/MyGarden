class Plant < ActiveRecord::Base
	has_many :logentries
	has_many :tasks
end
