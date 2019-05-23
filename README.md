Creator: Lang Faith

Last Updated: 05/23/2019

This is an instant-runoff software tailored towards the election process of the Cornell Branch of the Telluride House (CBTA).

The software uses source code by Chris Cartland:
https://github.com/cartland/instant-runoff

The main algorithm used for vote processing is Instant-Runoff voting (IRV) aka Ranked choice voting (RCV) with NO specific tie-breaker method set. The admin can decide what method(s) of tie-breaker to us at their own discretion. See more information at:
https://en.wikipedia.org/wiki/Instant-runoff_voting

HOW TO USE
1) Create a Google Form to ask users to RANK (instead of RATE) all candidates, starting from their top choice. <br />
    *Go to Settings and turn on "Limit to 1 response" to prevent repeated voting since keys are not in use for this software.
2) Users may list as least as ONE candidate as their choice(s) for a position.
3) Go to the responses of the form and click "View responses in Sheets."
4) Once the Google Sheets containing responses are created, open the document and go to "Tools."
5) Open "Script Editor."
6) Copy and paste the code from the code.java file in this repository. <br />
    *Alternatively, access the code at https://github.com/lm656/cbtaelections/blob/master/code.java 
7) Save the code and go back to the Sheets document. Under "Instant Runoff," click "Set Up" to find illegitimate responses. <br />
    *The illegitimate responses will have their timestamps highlighted in red. <br />
    *If "Instant Runoff" is not an option, go back to the Script Editor and run the function setup_instant_runoff() manually.
8) Under "Instant Runoff," click "Run" to see the elction results. <br />
    *If there is a tie, request a second round of voting or eliminate candidates with higher standard deviations.
9) Illegitimate responses can be tossed out or be edited (if the "Edit after submit" option is selected for the Google Form used).
10) If a voter decides to skip a choice and fill out all choices after the skipped choice (e.g. filling out top choice, then 3rd and 4th choice), then all choices after the skipped choice will be IGNORED. 
