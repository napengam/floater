floater
=======

flaoting / fixed header for tables

A small JavaScript file the fakes table headers 
by copying content from TH cells into DIVs .

These DIVs are at the same absolute left position as the 
corresponding TH.

When the original table header is scrolled out of view 
the fake header is scrolled into view at the very top of the table
and disapears when the eintire tabel is scroled out of view , 
or the original header comes back into view.

In addition to this you can now specify how many columns
from the left edge of the table should be moved into view
at the elft edge, if these will be scrolled out of view.

*15.01.2014

Added functionality to keep floating objects in sync with
content changes inside a table. 

In case rows are added or deleted the floating
left columns have to be adjusted  

In case content/geometry of columns change this has to be taken care of.
Influenc of these changes on left columns and header columns.


For details regarding usage and implementation please see 
files index.html and float.js 

As of  12.01.2014 this has been working for :
            
                IE9 , Chrome Version 23.0.1271.97,  FireFox 17.0.1 , 
                Opera 12.12, Safari 5.1.7.
 
