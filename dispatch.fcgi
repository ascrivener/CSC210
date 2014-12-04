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
# require 'fileutils'

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
db.execute "CREATE TABLE IF NOT EXISTS Users(name TEXT, pass TEXT, level INT)"

get '/' do
	if (request.cookies[request.ip])
		user = request.cookies[request.ip]
		# pass = (db.execute "SELECT pass FROM Users WHERE name='#{user}'")[0][0]
		# if (pass = )
		erb :main, :locals => {:name => user}
	else
		erb :form, :locals => {:wrong_pass => false}
	end
end

post '/' do
	user = params[:user_name]
	pass = params[:user_pass]

	var = (db.execute "SELECT EXISTS(SELECT * FROM Users WHERE name='#{user}')")[0][0].to_i
	if (var == 1)
		if (pass != (db.execute "SELECT pass FROM Users WHERE name='#{user}'")[0][0].to_s)
			erb :form, :locals => {:wrong_pass => true}
		else
			response.set_cookie(request.ip, :value => user, :expires => Time.now + 3600*24)
			erb :main, :locals => {:name => user}
		end
	else
		db.execute "INSERT INTO Users SELECT '#{user}', '#{pass}', 1 WHERE NOT EXISTS(SELECT * FROM USERS WHERE name='#{user}')"
		response.set_cookie(request.ip, :value => user, :expires => Time.now + 3600*24)
		erb :main, :locals => {:name => user}
	end
end

get '/logout' do
	response.delete_cookie(request.ip)
	redirect to('/')
end

get '/new_game' do
	user = request.cookies[request.ip]
	lev = db.execute "SELECT level FROM Users WHERE name='#{user}'"
	puts "********************#{lev}***************"
	erb :game, :locals => {:name => user, :level => lev[0][0]}
end

get '/continue_game' do
	redirect to ('/')
end

get '/profile' do
	user = request.cookies[request.ip]
	lev = db.execute "SELECT level FROM Users WHERE name='#{user}'"
	erb :profile, :locals => {:level => lev[0][0], :user => user}
end

get '/rules' do
	erb :rules
end

post '/post_save' do
	user = request.cookies[request.ip]
	# level = params[:level]
	# data = params[:data]
	save = params[:save]
	level = params[:level]

	unless Dir.exists?(File.join("saves","#{user}"))
		Dir.mkdir(File.join("saves","#{user}"))
	end

	puts "***********************************#{level}******************************"

	File.open(File.join("saves","#{user}","#{level}"),"w").write(save)
end

get '/get_save' do
	user = request.cookies[request.ip]
	level = params[:level]
	return File.open(File.join("saves","#{user}","#{level}")).read
end

post '/update_level' do
	user = request.cookies[request.ip]
	level = params[:lvl]
	puts "*******************#{level}**************"
	db.execute "UPDATE Users SET level=#{level} WHERE name = '#{user}'"
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