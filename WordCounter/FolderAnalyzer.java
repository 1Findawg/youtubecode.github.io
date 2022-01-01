import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.Scanner;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class FolderAnalyzer {
	private String folderPath;
	
	public FolderAnalyzer(String folderPath) throws IOException {
		this.folderPath = folderPath;
		for (String fileName : getListOfFilesInFolder()) {
			runFileReport(fileName);
		}
	}
	
	public int getNumOfFilesInFolder() {
		return new File(folderPath).list().length;
	}
	
	public String[] getListOfFilesInFolder() {
		return new File(folderPath).list();
	}
	
	public void runFileReport(String fileName) throws IOException {
		AnalyzedFile analyzedFile = new AnalyzedFile(fileName);
		try {
			BufferedReader bufferedReader = new BufferedReader(new FileReader(this.folderPath + "/" + fileName));
			int charCode = bufferedReader.read();
			String word = "";
			while(charCode != -1) {
				word += (char) charCode;
				if (word.contains(" ") || word.contains("\n")) {
					analyzedFile.handleWord(word.toUpperCase());
					word = "";
				}
				charCode = bufferedReader.read();
			}
			bufferedReader.close();
		} catch (FileNotFoundException e) {
			System.out.println("Error trying to read file: " + fileName + " Error: " + e);
		}
		
		writeFile(analyzedFile);
	}
	
	private void writeFile(AnalyzedFile analyzedFile) {
		File file = new File(this.folderPath + "/" + analyzedFile.getFileName() + "_Analyzed.txt");
		try {
			file.createNewFile();
			FileWriter fileWriter = new FileWriter(file);
			fileWriter.append("Original File: " + analyzedFile.getFileName() + "\n");
			fileWriter.append("Word Count: " + analyzedFile.getWordCount() + "\n");
			fileWriter.append("---------------------------------\n");
			fileWriter.append(analyzedFile.toStringWordOccuranceMap());
			fileWriter.close();
			
		} catch (IOException e) {
			System.out.println("FolderAnalyzer - writeFile: Failed - " + e);
		}
	}

	public static void main(String[] args) throws IOException {
		Scanner scan = new Scanner(System.in);
		System.out.println("Please enter the folder path to files you want analyzed:");
		FolderAnalyzer fileAnalyzer = new FolderAnalyzer(scan.nextLine());
		fileAnalyzer.runFileReport(fileAnalyzer.getListOfFilesInFolder()[0]);
		System.out.println("Analyzing done!!");
	}
}
