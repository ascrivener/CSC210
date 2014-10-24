#!/usr/bin/ruby
#
# Sample dispatch.fcgi to make Sinatra work on Bluehost
#
# http://www.sinatrarb.com/ 
#

require 'rubygems'

# *** CONFIGURE HERE ***
# You must put the gems on the path
ENV["GEM_HOME"] = "/home2/ascriven/ruby/gems"

# sinatra should load now
require 'sinatra'
require 'sqlite3'


module Rack
  class Request
    def path_info
      @env["REDIRECT_URL"].to_s
    end
    def path_info=(s)
      @env["REDIRECT_URL"] = s.to_s
    end
  end
end

# Define your Sinatra application here
class MyApp < Sinatra::Application
    db = SQLite3::Database.open "names.db"
db.execute "CREATE TABLE IF NOT EXISTS Users(name TEXT, level INT)"

user = ""

get '/' do
	if (request.cookies[request.ip])
		user = request.cookies[request.ip]
		erb :main, :locals => {:name => user}
	else
		erb :form
	end
end

post '/' do
	user = params[:user_name]
	response.set_cookie(request.ip, :value => user, :expires => Time.now + 3600*24)

	db.execute "INSERT INTO Users SELECT '#{user}', 0 WHERE NOT EXISTS(SELECT * FROM USERS WHERE name='#{user}')"

	erb :main, :locals => {:name => user} 
end

get '/logout' do
	response.delete_cookie(request.ip)
	redirect to('../dispatch.fcgi')
end

get '/new_game' do
	lev = db.execute "SELECT level FROM Users WHERE name='#{user}'"
	erb :game, :locals => {:level => lev[0][0]}
end

get '/increment' do
	lev = db.execute "SELECT level FROM Users WHERE name='#{user}'"
	db.execute "UPDATE Users SET level=#{lev[0][0].to_i+1} WHERE name='#{user}'"
	redirect to('../new_game')
end

get '/continue_game' do
	redirect to ('../dispatch.fcgi')
end

get '/profile' do
	lev = db.execute "SELECT level FROM Users WHERE name='#{user}'"
	erb :profile, :locals => {:level => lev[0][0]}
end
end

builder = Rack::Builder.new do
  use Rack::ShowStatus
  use Rack::ShowExceptions

  map '/' do
    run MyApp.new
  end
end

Rack::Handler::FastCGI.run(builder)
