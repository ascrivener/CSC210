require 'sinatra'
require 'sqlite3'
require 'sinatra/reloader'
require 'fileutils'
#require 'datamapper'

db = SQLite3::Database.open "names.db"
db.execute "CREATE TABLE IF NOT EXISTS Users(name TEXT, level INT)"

configure do
	@@user = ""
end

get '/' do
	if (request.cookies[request.ip])
		@@user = request.cookies[request.ip]
		erb :main, :locals => {:name => @@user}
	else
		erb :form
	end
end

post '/' do
	@@user = params[:user_name]
	response.set_cookie(request.ip, :value => @@user, :expires => Time.now + 3600*24)

	db.execute "INSERT INTO Users SELECT '#{@@user}', 0 WHERE NOT EXISTS(SELECT * FROM USERS WHERE name='#{@@user}')"

	erb :main, :locals => {:name => @@user} 
end

get '/logout' do
	response.delete_cookie(request.ip)
	redirect to('/')
end

get '/new_game' do
	lev = db.execute "SELECT level FROM Users WHERE name='#{}'"
	erb :game, :locals => {:name => @@user.to_s}
end

get '/continue_game' do
	redirect to ('/')
end

get '/profile' do
	lev = db.execute "SELECT level FROM Users WHERE name='#{@@user}'"
	erb :profile, :locals => {:level => lev[0][0]}
end

post '/post_image' do
	level = params[:level]
	data = params[:data]

	unless Dir.exists?(File.join("images","#{@@user}"))
		Dir.mkdir(File.join("images","#{@@user}"))
	end

	file = File.open(File.join("images","#{@@user}","#{level}"),"w")

	file.write(data)
end

get '/get_image' do
	level = params[:level]
	out = File.open(File.join("images","#{@@user}","#{level}")).read
	return out
end