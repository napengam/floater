floater
=======

fixed/sticky header and left columns for tables

A demo is located here <a href='http://hgsweb.de/floater'>hgsweb.de/floater</a>

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


As of  12.01.2014 this has been working for :
            
                IE9 , Chrome Version 23.0.1271.97,  FireFox 17.0.1 , 
                Opera 12.12, Safari 5.1.7.
 
