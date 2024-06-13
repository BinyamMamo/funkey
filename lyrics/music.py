from datetime import datetime

with open("lyrics.txt") as srt:
	title = srt.readline()

	with open("lyrics.xml", "w", newline="\n") as output:
		output.write("<LYRICS>")
		while line := srt.readline():
			id = line.strip()
			if not id:
				continue
			output.write("<VERSE>")

			interval = srt.readline().strip()

			lyrics = ""
			while line := srt.readline():
				if " --> " in line or line == "\n":
					break
				lyrics += line.strip()
				print(f"{lyrics = }")

			output.write("<LINE>")
			output.write(" ".join(lyrics.split()[1:]))

			output.write("</LINE>")

			output.write("<LENGTH>")
			stamps = interval.split(" --> ")
			stamps = [stamp.split(",")[0] for stamp in stamps]
			print(f"{interval = }")
			stamps = [datetime.strptime(stamp, "%X") for stamp in stamps]
			print(stamps)

			duration = stamps[1] - stamps[0]
			duration = duration.seconds * 1000
			output.write(f"{duration}") 
			output.write("</LENGTH>")

			output.write("</VERSE>\n")

		output.write("</LYRICS>")
