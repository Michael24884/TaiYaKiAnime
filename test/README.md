## Testing your work

---

After building a Source or Host, it is **extremely** important to test it out. Obviously loading the source/host into the app and having to restart the app several times is a bother, and definetly not dev friendly.

For that reason, these tests were made so you can run your sources directly from a single line. Tests are automatically done for you. Simply replace the default source to the one you are building and hit the run test button. (In Android Studios the shortcut is Alt + Shift + F9)

```dart

//IMPORTANT
  //Input your custom made Source here
  //Replace GogoAnime with the Source you are building
  setUp(() => base = new GogoAnime());

```

There are at least two other areas that require manual changing. For example the episode links as all websites are different.

Once replaced Taiyaki will automatially tell you if your work passes in the console.

```console
Testing started at 7:07 PM ...
/home/michael/snap/flutter/common/flutter/bin/flutter --no-color test --machine --start-paused test/sources_test.dart

PASSED SEARCH TEST
PASSED EPISODE LINKS TEST
PASSED HOSTS TEST

```

There are three tests for Sources:

* Search
* Episode discovery
* Hosts

And two tests for Hosts
