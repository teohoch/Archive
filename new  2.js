clearscreen.
set rpAlt to 100.
set rProgram to 90.
set r to 180.
set p to 0.
set y to 0.
set orbit to 0.
set tOrbit to 100000.
set hAtmo to 69500.
set tAngle to up + R(y,p,r).
set tThr to 1.
set turn1 to 9999.
set turn2 to 14999.
set turn3 to 19999.
set turn4 to 24999.
set turn5 to 49000.
set selection to 0.
set flagup to 0.
set flagdown to 0.
set confirm to 0.
                    // If your rocket has no aparagus stages set Count to 0.
set Count to 0.     // For aparagus. Count = Number of asparagus stages.
set aspFuel to 0.   // aspFuel = The amount of liquidfuel in one asparagus stage.

on abort { toggle ag2. wait until verticalspeed < 0. toggle ag3. }.

print "Select your orbit altitude.".
print "--------------------------------".
print " ".
print " ".
print "Use action group 9 to add 10Km to orbit alt.".
print " ".
print "Use action group 8 to remove 10Km from orbit alt.".
print " ".
print "Use action group 7 to confirm orbit alt.".

until selection = 1
	 {
	on ag9 set flagup to 1.
	on ag8 set flagdown to 1.
	on ag7 set confirm to 1.
	 
	 if flagup = 1
	 {
	 clearscreen.
	 print "Select your orbit altitude.".
	 print "--------------------------------".
	 print " ".
	 print "Default orbit alt is set to " + tOrbit + "m".
	 print " ".
	 print "Use action group 9 to add 10Km to orbit alt.".
	 print " ".
	 print "Use action group 8 to remove 10Km from orbit alt.".
	 print " ".
	 print "Use action group 7 to confirm orbit alt.".
	 print " ".
	 set tOrbit to tOrbit + 10000.
	 print "You have selected " + tOrbit.
	 toggle ag9.
	 set flagup to 0.
	 }.
	 
	 if flagdown = 1
	 {
	 clearscreen.
	 print "Select your orbit altitude.".
	 print "--------------------------------".
	 print "".
	 print "Default orbit alt is set to " + tOrbit + "m".
	 print " ".
	 print "Use action group 9 to add 10Km to orbit alt.".
	 print " ".
	 print "Use action group 8 to remove 10Km from orbit alt.".
	 print " ".
	 print "Use action group 7 to confirm orbit alt.".
	 print " ".
	 set tOrbit to tOrbit - 10000.
	 if tOrbit < 80000 { set tOrbit to 80000. }.
	 print "You have selected " + tOrbit + "m".
	 toggle ag8.
	 set flagdown to 0.
	 }.
	 
	 if confirm = 1
	 {
	 clearscreen.
	 print " ".
	 print "You have confirmed " + tOrbit + "m".
	 print " ".
	 print "Lift Off in 5s.".
	 toggle ag7.
	 set confirm to 0.
	 wait 2.
	 set selection to 1.
	 }.
 }.

set xOrbit to tOrbit + 1000.
set cAlt to tOrbit - (tOrbit*.05).
set xAlt to tOrbit - 1000.
set hAlt to tOrbit - 5.
clearscreen.
print "Orbit altitude set to " + tOrbit + "m".
lock steering to tAngle.
lock throttle to tThr.

print "3". wait 1.
print "2". wait 1.
print "1". Wait 1.
Print "Lift Off!". stage.

set StartFuel to <liquidfuel>.


when altitude > rpAlt then
 {
	 set r to rProgram.
	 print "Roll Program".
 }.

when altitude > turn1 then set p to -35.
when altitude > turn2 then set p to -45.
when altitude > turn3 then set p to -60.
when altitude > turn4 then set p to -75.
when apoapsis > turn5 then set p to -90.

when apoapsis > tOrbit then
{
	 toggle ag5.
	 set tThr to 0.
	 set Gk to 3.5316000*10^12.
	 set Radius to 600000 + apoapsis.
	 set iRadius to 600000 + ((apoapsis+periapsis)/2).
	 set tVel to (Gk/Radius)^0.5.
	 set iVel to (Gk/iRadius)^0.5.
	 set reqdV to (iVel-tVel).
	 set acceleration to (maxthrust/mass).
	 set burnTime to (reqdV/acceleration).
	 set tTime to (burnTime/2).
	 until altitude > hAtmo
	 {
		 if apoapsis < hAlt 
		 {
			set tThr to .1. 
		 }.
		 if apoapsis > tOrbit 
		 { 
			set tThr to 0. 
		 }.
	 }.
	 when eta:apoapsis < tTime then set tThr to 1.
 }.

when periapsis > cAlt then set tThr to .1.
when periapsis > xAlt then
{
	 if periapsis > xAlt OR apoapsis > xOrbit
	 {
		 set tThr to 0.
		 sas on.
		 print "You Are Now In Orbit".
		 set orbit to 1.
	 }.
 }.
 
until orbit = 1
 {
	 set StageSolid to stage:solidfuel.
	 Set StageLiquid to stage:liquidfuel.
	 set Lfuel to <liquidfuel>.
	 set tAngle to up + R(y,p,r).
	 
	 if Lfuel < StartFuel - aspFuel AND Count > 0
	 {
		stage. set StartFuel to Lfuel. set Count to Count - 1. 
	 }.
	 
	 if StageSolid > 0 AND StageSolid < 1
	 { 
	  stage. 
	 }.

	 if StageLiquid = 0 AND StageSolid = 0
	 { 
		if Lfuel > 0 
		{ 
			wait .1. stage. 
		 }. 
	 }.
 }.
 
set tThr to 0.
toggle ag1.
print " ".
print "Apoapsis is " + apoapsis + "m".
print " ".
print "Periapsis is " + periapsis + "m".
print " ".
print "Orbital Eccentricity is " +
 (((apoapsis + 600000)-(periapsis + 600000))/((apoapsis + 600000)+(periapsis + 600000))).
print " ".