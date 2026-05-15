Issues:
I performed unit testing and I found below issues:

Issue 1: On home page banner, movie name and details are visible, but images of movie is not visible, when I try to open image in browser tab by right click on image and open new tab, it shows "File Not Found" message.
Same issue with all images of movies, no any image is loading

Issue 2: when I go to sign up form, it just shows fields, it does not shows label on fields

Issue 3: When I go to seat selection, it shows message "Seat Selection — Coming in next sprint"

Issue 4: it only shows dark theme, I am not seeing button to view light theme

Issue 5: It shows banner for IPL, and shows button for Book IPL Tickets, but when I click on Book IPL Tickets button, it shows message "IPL 2026 — Coming in next sprint"

Issue 6: On movies, when I click on watch trailer, it redirects to youtube.com in new tab and shows youtube shows message "This video isn't available anymore". THis means youtube URL is not correct.
-> Also expected result is, open a dialog in the same screen and play a YouTube trailer video in same screen, no redirection on youtube

Issue 7: When I click on Events from the top navigation OR from footer link, it redirects to /events page, but shows message "Events — Coming in next sprint"

Issue 8: When I click on Sports from the top navigation OR from the footer link, it redirects to /events page, but shows message "Events — Coming in next sprint"

Issue 9: When I click on Play from top navigation OR from footer link, it redirects to /events page, but shows message "Events — Coming in next sprint"

Issue 10: When I click on My Bookings from logged in user's section from the top right corner, it redirects to /profile/bookings, but shows message "My Bookings — Coming in next sprint"

Issue 11: There is no any option to go to my profile and update the profile

Issue 12: When I click on Sign Out, it redirects to home page, but do not do sign out, it still shows logged in

Issue 13: On footer section:
-->Company
	- About Us - on clicking, nothing happens
	- Careers - on clicking, nothing happens
	- List your shows - on clicking, nothing happens
	- Blog - on clicking, nothing happens
--> Support
	- Help Centre - On clicking, it redirects to /help page, but it shows message "Help & FAQ — Coming in next sprint"
	- Careers - on clicking, nothing happens
	- List Your Show - on clicking, nothing happens
	- Blog -on clicking, nothing happens
--> Legal
	- Terms & condition  - on clicking, nothing happens
	- Privacy Policy - on clicking, nothing happens
	- FAQ - on clicking, nothing happens
	- Sitemap -on clicking, nothing happens

Issue 14: There is no any option to select cinema/venue , also movies are not listed based on selected location

Issue 15: Search in header is not working, when I type text on it, nothing happened

Issue 16: In home page it shows Live Events & Concerts, but when click on All Events link, it redirects to /Events page and shows message "Events — Coming in next sprint"

Issue 17:
It seems site is just showing UI/UX but nothing functionality is working

========================
Issue 19: In mobile view, after selecting movie, and selecting the venue and time, it is not showing seat selection button

issue 20: When click on Save Changes button on Edit Profile form, API call gived error 404 Not found.
Here is the API URL: 
http://localhost:5000/api/users/me

Issue 21: Even if I am logged in with admin user (superadmin@bookkaroo.com), and try to go to URL /admin, it redirects back to login page
=========================
Issue 22: When I go to Edit profile, it only shows Email address field values, all other fields are blank
--> Expected result is, it should show all field filled with submitted values

Issue 23: IN Admin panel -> select Movies -> shows message "Movies — Coming in next sprint"

Issue 24: IN Admin panel -> select Events -> shows message "Events  — Coming in next sprint"

Issue 25: IN Admin panel -> select venues -> shows message "venues  — Coming in next sprint"

Issue 26: IN Admin panel -> select shows -> shows message "shows  — Coming in next sprint"

Issue 27: IN Admin panel -> select bookings -> shows message "bookings  — Coming in next sprint"

Issue 28: IN Admin panel -> select Users  -> shows message "Users  — Coming in next sprint"

Issue 29: IN Admin panel -> select Reports  -> shows message "Reports   — Coming in next sprint"

Issue 30: IN Admin panel -> select CMS  -> Shos message "CMS   — Coming in next sprint"

Issue 31: IN Admin panel -> select settings -> Shos message "settings  — Coming in next sprint"

======================================
ISSUES AFTER SPRINT 15
Issue 1: On /admin/venues, while add or edit venue, on STATUS field, toggle button is overlap with text Active, also toggle button looks like DOT only, please update its UI
-> Alos in Amenities field, it does not show any changes while is selected or not selected, correct the UI 
-> Change the UI of Cancel and Create Venue buttons
Issue 2: on /admin/venues page UI issues
-> Correct the UI of Toggle button of Active and Inactive
-> Correct the UI of Cancel and Create Venue buttons
Issue 3: On /profile/bookings
-> On page load, Past always show 0 in bracket, it shows correct count only when we click on it
Issue 4: on /admin/shows
-> Correct the UI od Tabs of All, Schedules,Cancelled and Completed, its just shows as label
-> There is no any option for Filter by Venue
-> /admin/shows/Create Show -> Serch movie is not working
-> Also there should be filter for Movies/Event OR a general search box, which can search by Movie, event, venue, format/lang
-> Create conflicting show , even if there is conflict, it show No Conflit lable below date field
Issue 5: on /movies/kgf-chapter-2/showtimes
--> While selecting Time of show -> 10:00 - IMAX · Hindi, its just shows as label, so no ui changed when it is selected or not selected. please correc the UI
Issue 6: ON /admin/shows page Cancel a show with bookings:
-> But I already have booked ticket, so after cancellation, didn;t receveid any mail of bookings
================
Issues After SPRINT 16

Issue 1: In /admin/reports  page, Last 7 days, Last 30 days, and This month button shows as label, please correct UI

Isue 2: Verify home page reflects changes:
    Go to http://localhost:5173 → hero carousel / banner reflects active banners

Issue 3: Updated Max Seats per Booking to 11 in /admin/settings page, but it still allows only 10 bookings on /booking/{movieid}/seats page, 
Also Convenience fee updated on /admin/settings page does not reflected in booking page
-- Also verify all updates values on /admin/settings page are reflected on site
====================
Login or singup issue 

Issue 1: on /login page, if provide wrong password, then it shows "No refresh token." message 
Expected result - It should show message like wrong password

Issue 2: on /login page, When trying to login using correct mobile number and correct password it shows message "No refresh token."
Expected result - It should allow to login successfully

Issue 3: On /profile page, it should show the form wiht pre-filled values, but it shows blank full name and mobile number

Issue 4: After sometime, on refreshing page, it automatically redirect to login page. Increase the timout time to 2 hours if its set statically from frontent or backend

Issue 5: On /signup page, after signup, it is not sending welcome mail to user on provided email address

Issue 6: On Delete my account, it should send mail to user on his email address, you can decide email template on your own based on other email templates



=========================ABOVE DONE===============

STILL ISSUE AFTER SPRONT 15
Issue 2: on /admin/venues page UI issues
-> Correct the UI of Cancel and Create Venue buttons

Issue 3: On /profile/bookings
-> On page load, Past always show 0 in bracket, it shows correct count only when we click on it


Issue 4: on /admin/shows
-> /admin/shows/Create Show -> Serch movie is not working
-> Correct the UI of Movie and events selection in create show

Issue 6: ON /admin/shows page Cancel a show with bookings:
-> But I already have booked ticket, so after cancellation, didn;t receveid any mail of bookings

===sprint 16 issues==========
Issue 1: On /admin/bookings page, on selectig Resend mail, it sends mail of cancellation

Issue 2: Filter by City=Ahmedabad → Ahmedabad bookings only
There is no filter to filter by City in /admin/bookings page

Issue 3: Click a row → BookingDetailDrawer slides in from right
   Verify:
--> here Invoice and QR code is disabled

Issue 4: "Process Refund" should be shows for Cancelled bookings, but it shows for Confirmed bookings

Issue 5: User -> Booking -> Booking Detail -> here Invoice and QR code is disabled
======================================
Test 32: UI issue in login form -> Email or Mobile watermark text is overlapped with Email or 10-digit mobile watermarked text,
- But when we click on this field, it shows correctly
- Same issue wiht all fields of Signup form

Test 33: sign up -> fill the form -> submit the form -> mail received, but mail goes to spam folder in gmail
Expected : Mail should goes in Inbox

Test 6 - Forgot password:
  Go to /forgot-password
  Enter registered email
  Expected: Mall should be received and should have reset password link, and should be able to reset password from link
  Result: On clikcing Reset Password link, it redirect to home page

  Test 7- Guest user login -> Book ticket -> Choose seat -> asks for login, on login it redirects back to home page
  - It should redirect back to choose seat

  On changing City from home page city dropdown or search box, movies should updated

Events, plays , ipl not showing any data

Test with login using mobile number

FIRSTBOOK voucher should allow only once to one user

Implement chatbot for search and quick book

verify authentaction and authiorization
- open ticket of another user booking from URL and shoould not allow

Forget password

on giving wrong password, it shows "Request failed with status code 401" instead of wrong password message

Test remind me feature

increase the auto logout time for admin and end user
--
ask claude to rename and recrate md files accordong to courses of anthopic

Go to my bookings, and refresh , should not logout

Validation for signup form, for email, mobile number


/booking/{ID}/seats page, selecte 5 seats, unselect 3 seats , then clikc on pay now will redirect to /booking/checkout, from here now click Back button, it will show 3 unseleced seats as locked


Cancelled movie or event's seat/count should be updated  

On cancellation mail, showing incorrect refund amount

Invoice does not contains detials of movie/event

delete account - sign up using same email address

=======================================
## 14 may 2026
Here I have listed few issues, please review and solve it. Make sure that any updates you made in code do not affect or break other features:

Issue 1: Please correct the UI of all buttons, some buttons are looked like label only, so correct it

Issue 2: On /Events page, it show many events of Play and Sports as well, but on /Sports and /Plays page it does not show any event

Issue 3: While bookig -> seat selection, "GST 18%" it seems its statis, it should show based on selected GST Rate in /admin/settings page

Issue 4: On filling up the signup form and click on Submit, it should send a welcome mail to sigup user on the provided email address

Issue 5: While cancelling the ticket, it sends mail, but it does not contains details like movie/event name, date time, location, paid amoiunt and refund amount, you can generate mail template for this mail at your own by using the new booking email tempalte
-> Also while Delete account, it should send mail to use whose account is deleted

=============
## 14 may 2026 2
Issue 1: on /movies page, UI of each filter is looks like labels only please correc the UI of filters and also validate that filters are wokring correctly
-> Also correct the UI of Sort dropdown, on clicking Sort dropdown, it shows options but text are while so text are not visible

Issue 2: On /booking/confirmed page, Correc the UI of View my bookingd and Back to Home button

Issue 3: On /signup page, when fill the EMAIL address of existing user, and submit the form, it shows the message 'conflict', instead it should show proper message of already existing user with selected email address.







