from datetime import datetime

with open("input.txt") as srt:
	lines = srt.readlines()
	with open("output.txt", "w", newline="\n") as output:
		output.write("<LYRICS>")
		for i in range(len(lines)):
			line = lines[i].strip()
			if not line:
				continue
			output.write("<VERSE>")

			output.write("<LINE>")
			output.write(" ".join(line.split()[1:]))

			output.write("</LINE>")

			output.write("<LENGTH>")
			stamp = line.split()[0]
			stamp = datetime.strptime(stamp, "%X")
			nextStamp = stamp
			if i + 1 < len(lines):
				nextStamp = lines[i + 1].split()[0]
				nextStamp = datetime.strptime(nextStamp, "%X")

			duration = nextStamp - stamp
			duration = duration.seconds * 1000
			output.write(f"{duration}") 
			output.write("</LENGTH>")

			output.write("</VERSE>\n")

		output.write("</LYRICS>")
