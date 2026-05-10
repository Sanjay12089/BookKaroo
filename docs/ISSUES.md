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
=========================ABOVE DONE===============
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
  


