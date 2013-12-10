<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>

  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Directions service</title>
    <style>
      html, body, #map-canvas {
        height: 100%;
        margin: 0px;
        padding: 0px
      }
      .background-color-yellow { background-color: yellow; }
      #panel1 {
        position: absolute;
        top: 80px;
        left: 0%;
        margin-left: 10px;
        z-index: 5;
        background-color: #fff;
        padding: 5px;
        border: 1px solid #999;
        max-width: 300px;
      }
      #panel2 {
        position: absolute;
        top: 5px;
        left: 0%;
        margin-left: 350px;
        z-index: 5;
        background-color: #abc;
        padding: 5px;
        border: 1px solid #999;
      }
    </style>
    <link rel="shortcut icon" href="demo/images/favicon.ico">
<link rel="stylesheet" href="lib/demo/styles/main.css">
<link rel="stylesheet" href="lib/themes/default.css" id="theme_base">
<link rel="stylesheet" href="lib/themes/default.date.css" id="theme_date">
<link rel="stylesheet" href="lib/themes/default.time.css" id="theme_time">

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
    <script src="lib/FileSaver.js"></script>
    <script src="app/MapData.js"></script>
    <script>
    	google.maps.event.addDomListener(window, 'load', initialize);
    </script>
  </head>
  <body>
  <header class="section section--header section--splash">

        <div class="section__block section__block--scoped">
            <nav class="menu menu--header page-target" id="menu">
                <ul class="menu__list menu__list--header">
                    <li class="menu__item menu__item--touch menu__item--logo"><a class="menu__link menu__link--dimmed" href="index.htm"><span class="logocon"><span class="logocon__p">p</span><span class="logocon__u"></span></span></a></li>
                    <li class="menu__item menu__item--touch menu__item--toggle">
                        <a class="menu__link menu__link--dimmed page-target__display" href="#menu"><span class="page-target__toggle"></span></a>
                        <a class="menu__link menu__link--dimmed page-target__display--flip" href="#"><span class="page-target__toggle"></span></a>
                    </li>
                    <li class="menu__item menu__item--clear"></li>
                   
                    <li class="menu__item menu__item--responsive page-target__reveal menu__item--trail">
                        <span class="menu__link">Themes: <input class="theme-toggle__input" type="radio" id="show_theme_default" name="show_theme" value="default" checked hidden><label class="theme-toggle__label" for="show_theme_default">default</label> and <input class="theme-toggle__input" type="radio" id="show_theme_classic" name="show_theme" value="classic" hidden><label class="theme-toggle__label" for="show_theme_classic" class="checked-negative">classic</label></span>
                    </li>
                </ul>
            </nav>
        </div> <!-- .section__block -->
    </header> <!-- .section -->
    
	<br/>    
	  
    <div id="panel1">  
    	<b>Start: </b>
	    <select id="start">  
	      <option value="Ren Cen, Detroit, MI">RENCEN</option>  
	      <option value="chicago, il">Chicago</option>
	      <option value="st louis, mo">St Louis</option>
	      <option value="joplin, mo">Joplin, MO</option>
	    </select>
	    <b>End: </b>
	    <select id="end"> 
	      <option value="Muirwood Apartments, Farmington Hills, MI">MUWOOD</option>    
	      <option value="chicago, il">Chicago</option>
	      <option value="st louis, mo">St Louis</option>
	      <option value="joplin, mo">Joplin, MO</option>
	      <option value="oklahoma city, ok">Oklahoma City</option>
	    </select>

	      <table style="text-align:center;padding:15px;width:100%">
	      	<tr>
	      		<td>
	      			<img src='lib/recording.jpg' alt='blinking!' id='blinking_image'  style="display: block;  width: 50px; height: 50px; margin: 5px; padding: 5px; float: left;"/>
	      		</td>
	      		<td>
	      			<label class="theme-toggle__label" for="inputLogInterval">Enter in Sec</label> 
	      			<input type="text" id="inputLogInterval" value="" placeholder="5"  onchange="setVariableInterval( elementValue('inputLogInterval'))" style="display: block;  width: 130px; height: 34px; margin: 5px; padding: 5px; float: left;" />
	      		</td>
	      	</tr>
	      </table>
		 <table style="text-align:center;padding:15px;width:100%">
		 		<tr style="text-align:center;padding:5px;width:100%">
		 			<td style="text-align:center;padding:5px">
	    				<input type="button" value="Start Log" id="startLog" onclick="this.disabled=true;document.getElementById('stopLog').disabled=false;logger(true);blinker(true);" style="display: block; margin: 0px;  width: 120px; height: 34px; padding: 0px; "  />
	    			</td>
	    			<td style="text-align:center;padding:5px">
						<input type="button" value="Stop Log"  id="stopLog" onclick="this.disabled=true;document.getElementById('startLog').disabled=false;logger(false);blinker(false);" style="display: block; margin: 0px;  width: 120px; height: 34px; padding: 0px; "  />    	
	    			</td>
		 		</tr>
		 		<tr>
		 			<td style="text-align:center;">
			 			<label class="theme-toggle__label" for="selectIntervalType" style="text-align:center; display: block; margin: 0px;  width: 118px; height: 12px; padding: 0px; ">Select Interval Type</label>
		    			<input type="button" value="Using Input" id="selectIntervalType" onclick="selectIntervalType(this);" style="display: block; margin: 0px;  width: 120px; height: 34px; padding: 0px; " />
	    			</td>
	    			<td style="text-align:center;padding:5px">
			 			<label class="theme-toggle__label" for="saveMapData" style="text-align:center; display: block; margin: 0px;  width: 118px; height: 12px; padding: 0px; ">This'll stop logging</label>
	   					<input type="button" value="Save MapData"  id="saveMapData" onclick="saveAsCustom();" style="display: block; margin: 0px;  width: 120px; height: 34px; padding: 0px; " />
	    			</td>
		 		</tr>
 		 </table>
 		 <table style="text-align:center;padding:25px;width:100%">
		 		<tr>
			        <td style="text-align:center;padding:5px">
			            <label class="theme-toggle__label" for="highInterval">High Freq</label> 
			            <input type="text" id="highInterval" placeholder="1"/>
			        </td>
			        <td style="text-align:center;padding:5px">
			            <label class="theme-toggle__label" for="medInterval">Med Freq</label>
			            <input type="text" id="medInterval" placeholder="4"/>
			        </td>
			        <td style="text-align:center;padding:5px">
			            <label class="theme-toggle__label" for="lowInterval">Low Freq</label>
			            <input type="text" id="lowInterval" placeholder="8" />
			        </td>
			    </tr>
			    <tr id="slot1Row">
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot1Start">Slot 1 Start</label> 
			            <input type="text" id="slot1Start" placeholder="00:00"/>
			        </td>
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot1End">Slot 1 End</label>
			            <input type="text" id="slot1End" placeholder="07:00"/>
			        </td>
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot1Interval">IntType</label>
			            <input type="text" id="slot1Interval" placeholder="Low"/>
			        </td>
			    </tr>
			    <tr id="slot2Row">
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot2Start">Slot 2 Start</label> 
			            <input type="text" id="slot2Start" placeholder="07:31"/>
			        </td>
			        <td style="text-align:center; padding:5px;">
			            <label class="theme-toggle__label" for="slot2End">Slot 2 End</label>
			            <input type="text" id="slot2End" placeholder="09:00"/>
			        </td>
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot2Interval">IntType</label>
			            <input type="text" id="slot2Interval" placeholder="High"/>
			        </td>
			    </tr>
			    <tr id="slot3Row">
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot3Start">Slot 3 Start</label> 
			            <input type="text" id="slot3Start" placeholder="09:01"/>
			        </td>
			        <td style="text-align:center; padding:5px;">
			            <label class="theme-toggle__label" for="slot3End">Slot 3 End</label>
			            <input type="text" id="slot3End" placeholder="15:30"/>
			        </td>
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot3Interval">IntType</label>
			            <input type="text" id="slot3Interval" placeholder="Med"/>
			        </td>
			    </tr>
			    <tr id="slot4Row">
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot4Start">Slot 4 Start</label> 
			            <input type="text" id="slot4Start" placeholder="15:31"/>
			        </td>
			        <td style="text-align:center; padding:5px;">
			            <label class="theme-toggle__label" for="slot4End">Slot 4 End</label>
			            <input type="text" id="slot4End" placeholder="18:00"/>
			        </td>
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot4Interval">IntType</label>
			            <input type="text" id="slot4Interval" placeholder="High"/>
			        </td>
			    </tr>		
			    <tr id="slot5Row">
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot5Start">Slot 5 Start</label> 
			            <input type="text" id="slot5Start" placeholder="18:01"/>
			        </td>
			        <td style="text-align:center; padding:5px;">
			            <label class="theme-toggle__label" for="slot5End">Slot 5 End</label>
			            <input type="text" id="slot5End" placeholder="21:30"/>
			        </td>
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot5Interval">IntType</label>
			            <input type="text" id="slot5Interval" placeholder="Med"/>
			        </td>
			    </tr>
			    <tr id="slot6Row">
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot6Start">Slot 6 Start</label> 
			            <input type="text" id="slot6Start" placeholder="21:31"/>
			        </td>
			        <td style="text-align:center; padding:5px;">
			            <label class="theme-toggle__label" for="slot6End">Slot 6 End</label>
			            <input type="text" id="slot6End" placeholder="23:59"/>
			        </td>
			        <td style="text-align:center;padding:5px;">
			            <label class="theme-toggle__label" for="slot6Interval">IntType</label>
			            <input type="text" id="slot6Interval" placeholder="Low"/>
			        </td>
			    </tr>				    	    				    	    
			</table>
			
    </div>
    


    <div id="panel2">	
    </div>
    
    <div class="section__block section__block--scoped">    
	    
		    <b>Map Data Log:</b>
	    	<br/>
	    	<textarea id="mapDataTextBox" rows="4" cols="50" style="display: block; margin: 0px;  width: 1000px; height: 300px; padding: 0px; "></textarea> 
	    	<!--  
	        <h1 class="heading heading--divide-center heading--divide-first"><span class="heading__text">The Time Picker<a class="heading__anchor" name="picker" href="#picker">&sect;</a></span></h1>
	
	        <h3 class="heading heading--thin">The basic setup requires targetting an <code class="tag-name">input</code> element and invoking the&nbsp;picker:</h3>
			-->
	      
    </div> <!-- .section__block -->
    <!-- 
    Commenting out map canvas to make UI simpler
    <div id="map-canvas"></div>     
    <ul id="filelist"></ul>
    -->  
    <footer class="section section--footer">

        <div class="section__block section__block--scoped text-center">
            <h2 class="heading heading--one heading--divide-center"><span class="heading__text peace">&#x270C;</span></h2>
            <p class="heading heading--three heading--thin">Made by Anvesh</a>.</p>
            <p>Code licensed under <a href="http://opensource.org/licenses/MIT">MIT</a>.</p>
        </div> <!-- .section__block -->

    </footer> <!-- .section -->


         
    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-']);
        _gaq.push(['_trackPageview']);
        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    </script>
  </body>
</html>
