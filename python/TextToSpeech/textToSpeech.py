# https://gtts.readthedocs.io/en/latest/
from gtts import gTTS
import os
import sys

if len(sys.argv) == 2:
    text_file = open(sys.argv[1], "r")
    audioText = text_file.read()
    text_file.close()
      
    language = 'en'

    audioFile = gTTS(text=audioText, lang=language, slow=False)
      
    audioFile.save(sys.argv[1][:-4] + ".mp3")
    print("Done Recording")
