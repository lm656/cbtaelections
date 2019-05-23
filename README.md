This is an instant-runoff software tailored towards the election process of the Cornell Branch of the Telluride House (CBTA).

The software uses source code by Chris Cartland:
https://github.com/cartland/instant-runoff



HOW TO USE
1) Create a Google Form to ask users to RANK (instead of RATE) all candidates, starting from their top choice.
    *Go to Settings and turn on "Limit to 1 response" to prevent repeated voting since keys are not in use for this software.
2) Users may list as least as ONE candidate as their choice(s) for a position.
3) Go to the responses of the form and click "View responses in Sheets."
4) Once the Google Sheets containing responses are created, open the document and go to "Tools."
5) Open "Script Editor."
6) Copy and paste the code from the code.java file in this repository. <br />
    *Alternatively, access the code at https://github.com/lm656/cbtaelections/blob/master/code.java
7) Save the code and go back to the Sheets document. Under "Instant Runoff," click "Set Up" to find illegitimate responses.
    *The illegitimate responses will have their timestamps highlighted in red.<br />
    *If "Instant Runoff" is not an option, go back to the Script Editor and run the function setup_instant_runoff() manually.
8) Under "Instant Runoff," click "Run" to see the elction results.
    *If there is a tie, request a second round of voting or eliminate candidates with higher standard deviations.
