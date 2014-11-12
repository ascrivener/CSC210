# aclocal.m4 generated automatically by aclocal 1.5

# Copyright 1996, 1997, 1998, 1999, 2000, 2001
# Free Software Foundation, Inc.
# This file is free software; the Free Software Foundation
# gives unlimited permission to copy and/or distribute it,
# with or without modifications, as long as this notice is preserved.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY, to the extent permitted by law; without
# even the implied warranty of MERCHANTABILITY or FITNESS FOR A
# PARTICULAR PURPOSE.

# Like AC_CONFIG_HEADER, but automatically create stamp file.

# serial 3

# When config.status generates a header, we must update the stamp-h file.
# This file resides in the same directory as the config header
# that is generated.  We must strip everything past the first ":",
# and everything past the last "/".

AC_PREREQ([2.12])

AC_DEFUN([AM_CONFIG_HEADER],
[ifdef([AC_FOREACH],dnl
	 [dnl init our file count if it isn't already
	 m4_ifndef([_AM_Config_Header_Index], m4_define([_AM_Config_Header_Index], [0]))
	 dnl prepare to store our destination file list for use in config.status
	 AC_FOREACH([_AM_File], [$1],
		    [m4_pushdef([_AM_Dest], m4_patsubst(_AM_File, [:.*]))
		    m4_define([_AM_Config_Header_Index], m4_incr(_AM_Config_Header_Index))
		    dnl and add it to the list of files AC keeps track of, along
		    dnl with our hook
		    AC_CONFIG_HEADERS(_AM_File,
dnl COMMANDS, [, INIT-CMDS]
[# update the timestamp
echo timestamp >"AS_ESCAPE(_AM_DIRNAME(]_AM_Dest[))/stamp-h]_AM_Config_Header_Index["
][$2]m4_ifval([$3], [, [$3]]))dnl AC_CONFIG_HEADERS
		    m4_popdef([_AM_Dest])])],dnl
[AC_CONFIG_HEADER([$1])
  AC_OUTPUT_COMMANDS(
   ifelse(patsubst([$1], [[^ ]], []),
	  [],
	  [test -z "$CONFIG_HEADERS" || echo timestamp >dnl
	   patsubst([$1], [^\([^:]*/\)?.*], [\1])stamp-h]),dnl
[am_indx=1
for am_file in $1; do
  case " \$CONFIG_HEADERS " in
  *" \$am_file "*)
    am_dir=\`echo \$am_file |sed 's%:.*%%;s%[^/]*\$%%'\`
    if test -n "\$am_dir"; then
      am_tmpdir=\`echo \$am_dir |sed 's%^\(/*\).*\$%\1%'\`
      for am_subdir in \`echo \$am_dir |sed 's%/% %'\`; do
        am_tmpdir=\$am_tmpdir\$am_subdir/
        if test ! -d \$am_tmpdir; then
          mkdir \$am_tmpdir
        fi
      done
    fi
    echo timestamp > "\$am_dir"stamp-h\$am_indx
    ;;
  esac
  am_indx=\`expr \$am_indx + 1\`
done])
])]) # AM_CONFIG_HEADER

# _AM_DIRNAME(PATH)
# -----------------
# Like AS_DIRNAME, only do it during macro expansion
AC_DEFUN([_AM_DIRNAME],
       [m4_if(m4_regexp([$1], [^.*[^/]//*[^/][^/]*/*$]), -1,
	      m4_if(m4_regexp([$1], [^//\([^/]\|$\)]), -1,
		    m4_if(m4_regexp([$1], [^/.*]), -1,
			  [.],
			  m4_patsubst([$1], [^\(/\).*], [\1])),
		    m4_patsubst([$1], [^\(//\)\([^/].*\|$\)], [\1])),
	      m4_patsubst([$1], [^\(.*[^/]\)//*[^/][^/]*/*$], [\1]))[]dnl
]) # _AM_DIRNAME

dnl     $Id: acinclude.m4,v 1.1 2001/09/21 22:38:57 skimo Exp $

AC_DEFUN(FCGI_COMMON_CHECKS, [
    AC_CHECK_TYPE([ssize_t], [int]) 

    AC_MSG_CHECKING([for sun_len in sys/un.h])
    AC_EGREP_HEADER([sun_len], [sys/un.h],
	[AC_MSG_RESULT([yes])
	 AC_DEFINE([HAVE_SOCKADDR_UN_SUN_LEN], [1],
	   [Define if sockaddr_un in sys/un.h contains a sun_len component])],
	AC_MSG_RESULT([no]))

    AC_MSG_CHECKING([for fpos_t in stdio.h])
    AC_EGREP_HEADER([fpos_t], [stdio.h],
	[AC_MSG_RESULT([yes])
	 AC_DEFINE([HAVE_FPOS], [1], 
	    [Define if the fpos_t typedef is in stdio.h])],
	AC_MSG_RESULT([no]))

    AC_CHECK_HEADERS([sys/socket.h netdb.h netinet/in.h arpa/inet.h])
    AC_CHECK_HEADERS([sys/time.h limits.h sys/param.h unistd.h])

    AC_MSG_CHECKING([for a fileno() prototype in stdio.h])
    AC_EGREP_HEADER([fileno], [stdio.h], 
	    [AC_MSG_RESULT([yes]) 
	     AC_DEFINE([HAVE_FILENO_PROTO], [1], 
		   [Define if there's a fileno() prototype in stdio.h])],
	    AC_MSG_RESULT([no]))

    if test "$HAVE_SYS_SOCKET_H"; then
	AC_MSG_CHECKING([for socklen_t in sys/socket.h])
	AC_EGREP_HEADER([socklen_t], [sys/socket.h],
	    [AC_MSG_RESULT([yes])
	     AC_DEFINE([HAVE_SOCKLEN], [1],
			       [Define if the socklen_t typedef is in sys/socket.h])],
	   AC_MSG_RESULT([no]))
    fi

    #--------------------------------------------------------------------
    #  Do we need cross-process locking on this platform?
    #--------------------------------------------------------------------
    AC_MSG_CHECKING([whether cross-process locking is required by accept()])
    case "`uname -sr`" in
	IRIX\ 5.* | SunOS\ 5.* | UNIX_System_V\ 4.0)	
		    AC_MSG_RESULT([yes])
		    AC_DEFINE([USE_LOCKING], [1], 
		      [Define if cross-process locking is required by accept()])
	    ;;
	*)
		    AC_MSG_RESULT([no])
		;;
    esac

    #--------------------------------------------------------------------
    #  Does va_arg(arg, long double) crash the compiler?
    #  hpux 9.04 compiler does and so does Stratus FTX (uses HP's compiler)
    #--------------------------------------------------------------------
    AC_MSG_CHECKING([whether va_arg(arg, long double) crashes the compiler])
    AC_TRY_COMPILE([#include <stdarg.h>],
       [long double lDblArg; va_list arg; lDblArg = va_arg(arg, long double);],
       AC_MSG_RESULT([no]),
       [AC_MSG_RESULT([yes])
	AC_DEFINE([HAVE_VA_ARG_LONG_DOUBLE_BUG], [1],
	      [Define if va_arg(arg, long double) crashes the compiler])])

    AC_C_CONST 
])

