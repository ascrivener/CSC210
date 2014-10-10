#!/usr/bin/ruby

require 'cgi'
require 'sqlite3'

cgi = CGI.new("html3")
name = cgi["user_name"]

begin

	db = SQLite3::Database.open "data.db"
	db.execute "CREATE TABLE IF NOT EXISTS Names(Name TEXT)"

	if db.execute("SELECT 1 FROM Names WHERE Name='#{name}'").length > 0
		cgi.out{
			cgi.html{
				#cgi.head{"\n"+cgi.title{"TITLE"}} +
				cgi.body{"\n"+ "<center>"+
					cgi.h1{"Welcome back, #{name}!"}+"\n"+
					"If this is not you, please click <a href=\"http://ascriven.rochestercs.org\">here</a> to pick a new username or sign in again!</center>"
				}
			}
		}
	else
		#puts "adding user #{name} to database"
		db.execute("INSERT INTO Names Values ('#{name}')")

		cgi.out{
			cgi.html{
				cgi.body{"\n"+ "<center>"+
					cgi.h1{"Welcome, new user #{name}!"}+"\n"+
					"If you want to make a new username or sign in again to verify that an account was made in your name, click <a href=\"http://ascriven.rochestercs.org\">here.</a></center>"
				}
			}
		}
	end

	#if ((db.execute "SELECT EXISTS(SELECT 1 FROM Names WHERE Name='#{name}' LIMIT 1)") == 1)
	#	puts "exists!"
	#else
	#	db.execute "INSERT INTO Names VALUES('#{name}')"
	#end

rescue SQLite3::Exception => e

	puts "Exception occurred"
	puts e

ensure
	db.close if db
end

# cgi.out{
# 	cgi.html{
# 		cgi.head{ "\n"+cgi.title{"This is a test"}} +
# 		cgi.body{ "\n"+
# 			"test"
# 			cgi.submit
# 		}
# 	}
# }
