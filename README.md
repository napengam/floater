floater
=======

flaoting / fixed header for tables

A small JavaScript file the fakes table headers 
by copying content from TH cells into DIVs .

These DIVs are  the same absolute left position as the 
corresponding TH.

When the original table header is scrolled out of view 
this fake header is scrolled into view at the very top of the table
and disapears when the eintire tabel is scroled out of view , 
or the original header comes back into view.

For details regarding usage and implementation please see 
files index.html and float.js 

As of  25.12.2013 this has been working for :
            
                IE9 , Chrome Version 23.0.1271.97,  FireFox 17.0.1 , 
                Opera 12.12, Safari 5.1.7.
 
