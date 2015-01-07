floater
=======

fixed/sticky header and left columns for tables

Look at html/index.html  for usage.

A demo is located here <a href='http://hgsweb.de/floater/html'>hgsweb.de/floater</a>

A small JavaScript file implementing sticky table headers and 
sticky left columns to give you the freeze pane functionality 
as you find it in EXCEL-Spreadsheets.

This is achieved by using copies of the table header, all the left columns and
the top left corner, as a header for the left columns.

These elements are then placed on top or to the left of the table, using a style.position
value of 'fixed' or 'absolute' , depending on the element and scroll direction.

For details regarding usage and implementation please see 
files index.html and float.js 

A very simple overview is located at <a href='http://slides.com/heinzschweitzer/freeze#/' > Slides.com </a>


*15.01.2014

Added functionality to keep frozen and columns headers in sync with
content and geometry changes inside related table cells. 


As of  07.01.2015 this has been working for :
            
                IE , Chrome   FireFox   Opera 


Logic
=====

There are three main block of logic.

<b>The first block</b> is the construction of three containers to build
the header (theHeader) , the top left corner (theLeftCorner) being the left part of theHeader 
and the header for the fixed left columns (theLeftColumns).

<b>The second block</b> keeps track of horizontal and vertical scrolling of the table.
If the original table header, or the left columns (if specified) are about to be moved
out of sight some or all of the above containers will be displayed instead.

When scrolling verticaly the position value for theHeader and theLeftCorner will change to fixed 
so they will stay in view. The position value of theLeftColumns will be set to absolute so it will scroll verticaly. 

When scrolling horizontaly the position value for theLeftColumns and theLeftCorner will change to fixed so 
they will stay in view. The position value of theHeader will be set to absolute so it will scroll horizontaly. 
    
<b>The third block</b> is to synchronize all three container if any changes to the table layout happens, or the
position of the table within the document changes.