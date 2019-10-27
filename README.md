# Awaaz

## Inspiration

Approximately 7.5 million people in the United States have trouble using their voices. [Source](https://www.nidcd.nih.gov/health/statistics/statistics-voice-speech-and-language) Speech Therapy is often hard to find, expensive and subjective. Millions suffer over many years by speech impediments either caused by stroke or acquired via birth such as stutter.

"Spasmodic dysphonia (a voice disorder caused by involuntary movements of one or more muscles of the larynx or voice box) can affect anyone. The first signs of this disorder are found most often in individuals between 30 and 50 years of age. More women appear to be affected by spasmodic dysphonia than men." [Source](https://www.nidcd.nih.gov/health/statistics/statistics-voice-speech-and-language)

For patients not covered by health insurance, speech therapy typically costs $200-$250 for an initial assessment, then about $100 to almost $250 per hour. [Source](https://health.costhelper.com/speech-therapist.html) Speech therapy can easily be over 2 years causing significant levels of money being spent.

Bringing affordable speech impediment diagnosis and therapy will democratize this common problem and give access to low cost therapy to everyone. It'll also allow users to track their speech "scores" over time to catch any relapses and help doctors to check improvements.

## What it does

A simple frontend app records your voice and posts it to a backend app. The app runs multiple signal processing tasks such as spectral rolloff, Mel-frequency cepstral coefficients and centroid computation. These scores are then fed into a machine learning algorithm trained on a dataset of speech impediment audio recordings and their synthesized versions. The backend app also uses Google's Speech to Text to transcribe the audio and Text To Speech to get a machine benchmark for voice. A person's voice metrics are gauged against the _synthetic_ voice that's generated by the combination of Google Speech to Text and Google Text To Speech.

These benchmarks form the basis of an ML classifying model that returns back the certainty of a speech impairment. These metrics are also surfaced to the user to allow them to track their speech therapy over time.

## How I built it

1. Google Cloud AutoML
2. GCP Speech to Text and Text to Speech apis
3. Hasura GraphQL
4. React
5. Pandas and Principal Component Analysis analysis using scikit-learn.
6. Auth0 for Google SSO

## Challenges I ran into

1. Finding the dataset. I had to scrape through research blogs to find a speech impediment dataset.
2. Data cleaning: Audio files come in different formats and a significant time went to converting audio files from webm to wav to lossless codecs.
3. Feature Engineering: There are many ways to run audio signal processing but I needed to find those that gave the largest classifier accuracy. I used PCA to pick the top 4 audio processing functions.

## Accomplishments that I'm proud of

1. Developed an end to end ML pipeline!
2. Worked on healthcare and tech for social good.

## What I learned

1. Feature Engineering
2. ML data pipeline setup

## What's next for AwaazApp

1. Better classification scores
2. Better UX to track speech therapy
