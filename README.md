# Mellowdies

## How To Run:

Navigate to the project directory in your command line interface and run the command "npm run dev" to run Mellowdies in your default web browser.

## Project Documentation:

### General Information
Members and Roles:
- Jamesline Jeudy (Team Lead/UX Designer)
- Nathan Jones (Scrum Master/Backend Developer)
- Quan Nguyen (Backend Developer)
- Victoria App (Frontend Developer/UX Designer)
- Kevin Yue (Project Manager/Backend Developer)

Advisor: Emmanuel Dorley  
Advisor Email: edorley@ufl.edu

### Abstract

Mellowdies is an innovative real-time audio editing web application for podcasters, musicians, and audio enthusiasts.  This application offers a wide range of features such as applying audio 
effects, trimming, and volume adjustments in addition to an AI music generator, wrapped in a user-friendly and accessible package that can be run in any browser without additional downloads. 
* Keywords: audio, artificial intelligence, editing, user-friendly, accessibility, audio production, audio engineering

### Introduction

The problem that our group set out to solve with this project was manifested by the booming success of the audio streaming industry, where a seemingly countless number of independent music 
artists and podcasters have been able to kickstart their careers by publishing their work independently on platforms such as Spotify and Soundcloud. As the industry has grown, a significant 
challenge has emerged: the high barriers to entering audio production. These obstacles include the steep learning curve of traditional audio editing software, hefty download requirements, high 
costs, and the extensive music theory knowledge aspiring musicians need to succeed in the field.

To provide a solution to this problem, Mellowdies combines AI generation with traditional music editing tools to service both newcomers and veteran music producers from the comforts of their 
browsers. Digital audio workstation (DAW) applications like Bandlab and Descript have made strides by offering a browser-based audio editor and an AI-powered audio generator, respectively. 
However, these solutions often come with drawbacks such as a steep learning curve, financial costs, or a lack of seamless integration with essential tools like AI within the same platform. 
Mellowdies serves as a comprehensive digital audio workstation that builds upon previous DAWs by integrating their best features (various audio editing tools and AI music generation) into a 
free web application that can be easily accessed and utilized to create quality music, regardless of how skilled or experienced the user is at editing and manipulating audio. Our team is 
confident that a solution that builds upon the innovations of previous audio editing breakthroughs while circumventing the stopgaps associated with modern editing software will allow the audio 
streaming industry to get over the “barrier to entry” problem.  

### Problem Domain

The domain in which the problem our group has attempted to solve lies within the area of audio engineering, as our solution to the problem, Mellowdies, is an audio engineering platform that 
provides potential audio engineers with a digital audio workstation that provides them with a variety of modern audio engineering tools to create whatever music, podcasts or other audio samples 
they desire in an environment that is easy to use and understand. In order to develop Mellowdies into a solution that fits within this problem domain, our group has utilized research and tools 
from various resources in the field of audio engineering as well as our own computer science expertise in order to build the best platform possible for the goals we have set out to achieve.

### Literature Review

The number of musicians and podcasters is growing due to how the audio-streaming industry has grown over the last few years. According to Andrea Zarczynski from Forbes [2], there are now 
significantly more independent artists due to music artists' declining record label deals in pursuit of more creativity and ownership of their works. This means that they are taking control of 
their production, which in turn grows the demand for digital audio workstations (DAWs). Recent research from SearchLogistics [3] concluded that the leading platform Spotify has 11 million artists 
and creators who upload on average about 1.8 million new songs every month, which is an all-time high. They also have a growing library of podcast titles - based on an article by Josh Howarth [6], 
the number of new podcasts was up by 202.33% in 2020 with there being around 3.28 million new podcasts up for listening as of 2024. 

When people think of DAWs, they tend to assume only big-shot producers can figure out how to use them. With Mellowdies, we have created a user-friendly interface with all of the features that are 
needed to create whatever the user desires. This brings us to a pertinent question: why should users choose Mellowdies over existing DAWs? 

With Mellowdies, we set out to create a DAW that is an innovative tool for all types of audio editing, not just music. To accomplish this, it will include features such as real-time audio 
editing in the browser, AI audio generation assistance, a user-friendly interface, and optimized presets for a range of audio effects users may be interested in. While other programs have some of 
these features, we have found that they struggle to encompass all of them. For example, Bandlab is free and browser-based, offering a range of editing tools, effects, and access to library loops and 
samples - however, it is tailored more to just musicians rather than the broader scope that we are trying to reach. When it comes to AI integrations, it fails to have AI-driven tools that assist in 
audio editing and it doesn’t have AI generation for specific sounds. Mellowdies seeks to change that by combining the positives of Bandlab with powerful AI audio generation.

If we look at a more AI-driven program such as Descript, we would find that it does have an AI assistant, but it is more podcast-focused and not entirely browser-based. It is user-friendly and 
accessible, but it leaves musicians out of the picture. Auphonic is another AI-powered audio processing tool that can effectively assist its users, but it serves as more of a complement to other 
audio editing tools rather than a full-on DAW. With Mellowdies, we could take what these programs have started and mold it into a more user-friendly all-encompassing DAW. 

Overall, the main issues with all existing solutions are that they either have a steep learning curve, cost money, aren’t browser-based for portability and compatibility, or don’t have fully integrated 
AI-driven tools. Mellowdies takes all these features that musicians, podcasters, and audio engineers alike need and want in a digital audio workspace and puts them into one easy-to-use web application.

### Solution

In order to pose an effective solution to the ‘barrier to entry’ problem plaguing the audio streaming industry, our team designed Mellowdies as a digital audio workstation in the form of a web application. 
We chose to develop our system in the web application format due to the accessibility and reliability of web apps that our team has interacted with through prior experience. Specifically, we’ve found that 
any web application can be freely accessed from a common web browser, and that the market for web applications in today’s world is projected to increase by over 460 million dollars according to projections 
from Grand View Research [8]. With this in mind, we’re confident that a web application-based solution will offer prospective audio engineers with the best possible audio editing functionality at any skill 
level even as audio editing technology continues to progress going forward into the future. 

The technical development of Mellowdies was focused on two major functionality requirements: an audio editing mixer which contains a slate of editing tools that range from basic to advanced levels of 
audio detail, and an artificial intelligence (AI)-based music generator that can modify the characteristics of a given audio sample based on a text prompt written by the system’s user. Both of these 
key features offer merits that are essential to ensuring that Mellowdies is a comprehensive software platform that emphasizes the ease of editing audio with its tools regardless of what type of audio 
sample (music, podcasts, etc.) a user is looking to modify within the platform. While the suite of functions and audio effects present within the audio mixer allow for further refinement and control 
with editing pre-existing audio samples uploaded to Mellowdies, the AI music generation tool can assist users in developing an entirely new audio sample that can then be further refined with the 
mixer functionality; thus allowing both of these key project functionalities work in tandem to form a solution to the “barrier to entry” problem. 

Accessible within the ‘Mixer’ menu on the Mellowdies landing page, the audio editing mixer functionality contains a library of ten different audio effects for users to apply to an audio sample, with 
each effect having its own array of settings that can be adjusted to further refine the change being applied to the user’s sample (for example, the amount of feedback applied to the audio delay effect 
or the specific equalization being applied to the sample at specific Hertz (Hz) values within the ten-band equalizer). While each audio effect has a different impact on the sample being edited, every 
effect operates based on the same foundation: a combination of the Wavesurfer.js library and AudioBuffer class via the framework of the JavaScript language. Wavesurfer.js is an open-source library 
which can render an audio sample into a waveform that can be interacted with through a simple click input. Furthermore, users can click and drag the waveform that a waveSurfer instance creates for 
their audio sample to select a region of their audio to be edited separate from the rest of the sample. On the other hand, AudioBuffer is a class that enables Mellowdies to store the audio sample being 
edited in its own unique audio buffer. In Mellowdies, when a user chooses to apply an audio effect to a section of their sample’s waveform, the system obtains the decoded data of the sample in an audio 
buffer; at this point, Mellowdies clones the buffer as a data backup before utilizing effect-specific methods to manipulate the selected portion of the user’s audio and achieve their desired change. 
If the user is unhappy with their changes, the audio mixer enables them to undo their previous change, redo any changes that had been undone or reset their audio sample back to its original state at 
any point. Additionally, the mixer also allows the user to cut or copy selected regions of their audio sample and paste them over any part of the sample for further editing flexibility. All of these 
features within the mixer functionality ensure that Mellowdies can provide users with several audio editing techniques that are both simple to grasp and effective to use.

The artificial intelligence-based music generation functionality can also be accessed directly from the Mellowdies landing page via the ‘AI Editor’ menu. This feature presents users with multiple 
levels of music generation detail that can be employed in the audio editing process; after providing Mellowdies with a prompt that describes the type of sound they would like the AI to focus on, 
users can choose whether they would like the AI generator to edit a selected portion of their audio sample, edit the entire sample, edit a separate audio file uploaded to Mellowdies from the 
‘AI Editor’ menu, or simply generate a brand new sample based on the user’s prompt. This functionality is made possible through the MusicGen API, an interface containing a single language model 
which enables Mellowdies to “generate high-quality samples… while being conditioned on textual description or melodic features” [5]. Our team decided that MusicGen would be the best model within 
reason to construct the AI generation functionality of our solution due to how well the characteristics of MusicGen aligned with the goals our team set for the development of Mellowdies. As the 
MusicGen study “Simple and Controllable Music Generation” states, the model allows for “better control(s) over the generated output” without overcomplicating the process for users to wield MusicGen 
for their audio editing needs [5], making it a good match for a system designed to combat the ‘barrier to entry’ problem often caused by audio editing software which offers functionality at the cost 
of overall ease of use. This tradeoff, however, is not the case for the MusicGen model: the authors of “Simple and Controllable Music Generation” state throughout their study that the audio samples 
generated by MusicGen adhere to a high quality standard for text-to-music generation. Specifically, the audio generated by MusicGen passes through the model over “several streams of compressed discrete 
music representation” [5] in the form of discrete audio tokens, which the authors then quantify in order to prove the effectiveness of audio samples generated by MusicGen.

![MusicGen table](SCMG1.png)
