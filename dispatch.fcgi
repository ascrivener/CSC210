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
	redirect to('/')
end

get '/new_game' do
	user = request.cookies[request.ip]
	lev = db.execute "SELECT level FROM Users WHERE name='#{}'"
	erb :game, :locals => {:name => user}
end

get '/continue_game' do
	redirect to ('/')
end

get '/profile' do
	user = request.cookies[request.ip]
	lev = db.execute "SELECT level FROM Users WHERE name='#{user}'"
	erb :profile, :locals => {:level => lev[0][0]}
end

post '/post_image' do
	user = request.cookies[request.ip]
	level = params[:level]
	data = params[:data]

	unless Dir.exists?(File.join("images","#{user}"))
		Dir.mkdir(File.join("images","#{user}"))
	end

	file = File.open(File.join("images","#{user}","#{level}"),"w")

	file.write(data)
end

get '/get_image' do
	user = request.cookies[request.ip]
	level = params[:level]
	out = File.open(File.join("images","#{user}","#{level}")).read
	return out
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
