Eager scrummer allows you to compare your **Actual** and **To Do** every scrum morning and evening.

Compare the app calculated hours with your numbers this will enable you to catch up or even slow down to your burn down chart.


## User Manual

```
- Give the app one of your known sprints [Edit ScrumHours.tsx]
    eg. const knownSprint = { startDate: moment("04/01/2020", "MM/DD/YYYY"), endDate: moment("04/14/2020", "MM/DD/YYYY"),
    sprintNumber: 7 };
    
    This defines a known sprint, started April 1st, 2010 and ended April 14, 2020, the sprint number was 7, The program will
    use these dates to know your scrum length, sprint start day of the week, etc...

2- Edit your capacity, the default value is 60 for a two weeks sprint

3- The app will calculate the current sprint number based on today's date relative to end date of the last known sprint, it will increment sprint number untill today.

4- To use the app in the morning, compare the morning **To Do** hours with your real life **To Do** hours, if they match you rock! If they don't, let the app hours prevail :(

5- To use the app in the evening, use the evening hours instead! Do not forget to compare the **Actual** hours as well.

6- If you want to know what tomorrow hours should look like, use the arrow on the top right to go to tomorrow, or the top left to go back one day.

7- If the sprint have a day off, enter that day using the vacations form

8- If you want a place to remember what storeis you are going to work on this sprint, use the story form

9- Finally, Enjoy the points-to-hours-to-days conversion chart!

```
<img width="1151" alt="image" src="https://user-images.githubusercontent.com/9623964/84615016-9fe53d80-ae7c-11ea-9e9a-9143961547bf.png">

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T71S4BB)




