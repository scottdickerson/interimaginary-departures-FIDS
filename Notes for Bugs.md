-   Loose wire in the relay unit

-   Comprehensive shutdown the airport went dark

## Questions

-   What went wrong with the computers rebooting
-   Reboot every day for 24 hours
-   Can we get a log of why the logos are failing, I assume that the react would crash. Can I reproduce if I increase the time to advance? so that it wraps more quickly?
-   If they don't get to the logo issue in time the screen shuts off goes blank, not sure why this would be the case

-   What does it mean that the audio fails after a while between the computers?
-   Could it be the third daily reload that breaks the memory consumption?
-   Why would the screen go black?
-   Why in the world do I have a local state in addition to the redux state for flights?
-   Why am I updating the time every 5 seconds!? Seems like overkill

I have 3 interval timers going at once here.... crazy, I could keep track of the current page of data, assume that the next flight is on the top of the first page. Only shift the flights over by one, really I'm just stripping it off the array right? SetFirstRowIsGray is
unnecessary if I just use the flight page index

Take the full list of flights which has duplicates at different times in the future. If I sort

### API Server

-   Is it the memory on the API server itself that's crashing? How many times am I actually loading the API server?
-   Why am I reloading the file itself every time the API call is made..., seems non-ideal though it shouldn't

## Plans

-   Why am I doing so many useEffects?
-   Would using react query help any?
