<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
    <HEAD>
        <meta name="keywords" content="javascript floating header ajax grid inplace edit mysql php">
        <TITLE>Floating Headers</TITLE>
    </HEAD>

    <style type="text/css">

        .tgrid{
            font-family: Courier;
            text-decoration: none;
            word-spacing: normal;
            text-align: left;
            letter-spacing: 0;	
            font-size: 1em;
            border-collapse:collapse;
        }
        .tgrid tr{
            font-family: Courier;
            text-decoration: none;
            word-spacing: normal;
            text-align: left;
            letter-spacing: 0;	
            font-size: 1em;
            border: 1px solid black;
        }
        .tgrid td{
            text-align: left;	
            letter-spacing: 0;
            border-color: black;
            font-size: 1em;
            border: 1px solid black;
        }
        .tgrid th{
            word-spacing: normal;
            border-collapse:collapse;
            margin:0;
            padding-bottom:4;
            border-margin:0;
            border-color: black;
            font-weight:bold;
            font-size:1em;
            text-align: center;	
            background-color:#eeeeee;	
            border: 1px solid black;
        }

        .divouterfloat{
            font-family: Arial,Helvetica,sans-serif;
            text-decoration: none;
            word-spacing: normal;
            text-align: left;
            vertical-align:bottom;
            letter-spacing: 0;
            background-image: url("stripes.gif");
            background-repeat:repeat;
            margin:0;
            padding:0;
            border-bottom:1px solid black;

        }
        .divfloat{
            word-spacing: normal;
            border-collapse:collapse;
            margin:0;
            padding-bottom:4px;
            border-color: black;
            font-weight:bold;
            font-size:1em;
            text-align: center;
            float:left;
            border:0;
            background-image: url("stripes.gif");
            font-family: monospace;
            white-space:pre;
            border-left: 1px solid black;
            border-bottom:1px solid black;

        }
    </style>
    <script type="text/javascript" >
        //
        //*****************************************************************************
        // Developed by Heinz Schweitzer based on ideas and code in 
        // the  floating Menu script- by Roy Whittle (http://www.javascript-fx.com/)
        //*****************************************************************************
        //
       
        ///////////////////////////////////////////////////////////////////    
        ///////////// keeps floating header in sync with current geometry
        ///////////////////////////////////////////////////////////////////    
        
        function sync_floater(tablename)
        /*********************/
        {
            var head=document.getElementById(tablename);
            var ch=head.rows[0].cells;
            var cf=head.floatingdiv.childNodes;
            var nc=ch.length,i;
            head.floatingdiv.style.width=head.clientWidth+'px';
            for(i=0;i<nc;i++){
                cf[i].style.width=ch[i].clientWidth+'px';
            } 
            /// table has probably been moved 
            var obj=head;      
            var offsettop=obj.offsetTop;
            var offsetleft=obj.offsetLeft;
            while(obj.offsetParent.tagName!=="BODY"){
                obj=obj.offsetParent;
                offsettop+=obj.offsetTop;
                offsetleft+=obj.offsetLeft;
            }
            var height=head.clientHeight;	
            head.floatingdiv.ybottom=offsettop+height-head.floatingdiv.clientHeight;
            head.floatingdiv.tabtop=offsettop;
            head.floatingdiv.x=offsetleft;
               
            return ;
        }
        //////////////////////////////////////////////////////////////
        //////// Creates divs to mimic the table header, then floats it.
        ////////////////////////////////////////////////////////////// 
        function float_header(tablename)
        /*****************************/
        {
            var pY,obj=document.getElementById(tablename);
            var mytable=obj;
            var floatoffsetleft=0;
            
            if (window.stayTopLeft===undefined){
                window.stayTopLeft=[];
            }
            while(obj.offsetParent.tagName!=="BODY"){
                floatoffsetleft+=obj.offsetParent.offsetLeft;
                obj=obj.offsetParent;
            }
            obj=mytable;
            var startX = mytable.offsetLeft+floatoffsetleft;
	 
            window.stayTopLeft[tablename]=function(floater)
            /**********************************/
            {
                var p,ftlObj=document.getElementById(floater);
            
                p=get_document_offsets(); 
                var scrOfY=p.y;
                if(scrOfY===0){
                    ftlObj.style.display="none";             
                    ftlObj.sync=false;
                    setTimeout("stayTopLeft['"+tablename+"']('"+floater+"')", 30);
                    return;
                } else {              
                    pY =scrOfY ;
                    if(pY>ftlObj.ybottom){
                        ftlObj.sync=false;
                        setTimeout("stayTopLeft['"+tablename+"']('"+floater+"')", 30);
                        return;
                    }
                    if(ftlObj.tabtop-pY < 0){
                        if(ftlObj.y!=pY+'px'){                           
                            ftlObj.y=pY+'px';
                            ftlObj.sP(ftlObj.x, ftlObj.y);
                            ftlObj.style.display='';
                            ftlObj.sync=true;
                        } else if( ftlObj.sync){
                            sync_floater(tablename);
                            ftlObj.sync=false;
                        }
                        setTimeout("stayTopLeft['"+tablename+"']('"+floater+"')", 20);
                        return;
                    } else {
                        ftlObj.style.display="none";
                        ftlObj.sync=false;
                        setTimeout("stayTopLeft['"+tablename+"']('"+floater+"')", 30);
                        return;
                    }
                }
            }
            var t,d = new Date();
            t=d.getTime();
            var i,div;
            var floatingdiv=document.createElement("div");
            mytable.floatingdiv=floatingdiv;
            floatingdiv.id="float"+mytable.id+t;        
            floatingdiv.className='divouterfloat';
            floatingdiv.style.width=mytable.clientWidth+"px";
            floatingdiv.style.height=mytable.rows[0].cells[0].clientHeight+"px";
            floatingdiv.style.position="absolute";     
            var nc=mytable.rows[0].cells.length;
            for(i=0;i<nc;i++){ // copy over header cells from table
                div=document.createElement("div");
                div.innerHTML=mytable.rows[0].cells[i].innerHTML;
                div.className='divfloat';
                div.cellIndex=i; // fake it
                div.style.width=mytable.rows[0].cells[i].clientWidth+'px'           
                div.style.height=mytable.rows[0].cells[i].clientHeight+'px'           
                floatingdiv.appendChild(div);
            }
            document.body.appendChild(floatingdiv);	
            var py,offsettop,height;
            obj=mytable;
            offsettop=obj.offsetTop;
            while(obj.offsetParent.tagName!=="BODY"){
                obj=obj.offsetParent;
                offsettop+=obj.offsetTop;
            }
            height=mytable.clientHeight;	
            floatingdiv.ybottom=offsettop+height-floatingdiv.clientHeight;
            floatingdiv.tabtop=offsettop;
            floatingdiv.sP=function(x,y){
                this.style.left=x;
                this.style.top=y;
            }
            floatingdiv.x = startX;
            floatingdiv.style.left = startX+'px';
        
           
            floatingdiv.y = py+offsettop;
            floatingdiv.py = 0;
            floatingdiv.sync=true;
            stayTopLeft[tablename](floatingdiv.id);
            return floatingdiv;
        }
        
        function get_document_offsets()
        {//////////////////////////////
            if( typeof( window.pageYOffset ) == 'number' ) {              
                scrOfY = window.pageYOffset;
                scrOfX = window.pageXOffset;      
            } else if( document.documentElement && !isNaN(( document.documentElement.scrollLeft + document.documentElement.scrollTop )) ) {             
                scrOfY = document.documentElement.scrollTop;
                scrOfX = document.documentElement.scrollLeft;
            }                 
            return {
                'x':scrOfX,
                'y':scrOfY
            };
        } 
    </script>
    <body onload="float_header('mytable');float_header('myothertable');float_header('hugo');float_header('otto');">
        <div align=center>
            <H1> Flying floating table headers </h1>
            <h2>Scroll the tables out of sight</h2>
            All you need is in the source of this page. Feel free to use and modify to your liking.<br>
            Let me know your thoughts  email to  hgs(at)hgsweb(dot)de
            <hr>
        </div>
        <table><tr valign=middle><td><h1> FLOAT </h1></td> <td>
                    <table class=tgrid id=mytable>
                        <tr><th>hhhhhhhhhhhhhhhhh</th><th>wwwwwwwwwwwwwww</th><th>dddddddddddddddd</th><th>UUUUUUUUUUUUUUUUUUUU</th></tr>
                        <tr><td></td><td></td><td></td><td></td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>a</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaz33333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>a</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td></td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aazaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td></td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vazaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td></td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td></td><td>vaaaaa</td></tr>
                    </table>
                </td><td>
                    <table  class=tgrid id=myothertable>
                        <tr><th>hhhh</th><th>wwwwweww</th><th>dd4444<br>4ddddddd</th><th>xxxxxxxxxxxxUUUUUUUUU</th></tr>
                        <tr><td></td><td></td><td></td><td>.</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>335345345</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td></td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td></td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaataa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
                        <tr><td>aaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td></td></tr>
                    </table>

            </tr></table><p>
        <table class=tgrid id=otto>
            <tr><th>hhhhhhhhhhhhhhhhh</th><th>wwwwwwwwwwwwwww</th><th>dddddddddddddddd</th><th>UUUUUUUUUUUUUUUUUUUU</th></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
            <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        </table>
    </p>
    <p>
    <table class=tgrid id=hugo>
        <tr><th>hhhh</th><th>wwwwweww</th><th>dd44444ddddddd</th><th>xxxxxxxxxxxxUUUUUUUUU</th></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
        <tr><td>aaaaaaaaaaaa</td><td>aaatttttaaaaa</td><td>aaaaaaa333333</td><td>vaaaaa</td></tr>
    </table>
</body>
</html>