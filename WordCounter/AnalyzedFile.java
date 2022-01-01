import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AnalyzedFile {
	
	private String fileName;
	private Map<String,Integer> wordOccuranceMap;
	private int wordCount;
	
	public AnalyzedFile(String fileName) {
		this.fileName = fileName;
		this.wordOccuranceMap = new HashMap<String,Integer>();
		this.wordCount = 0;
	}
	
	public void handleWord(String word) {
		String[] wordArrayList = cleanWord(word);
		for (String wordEntry : wordArrayList) {
			if (this.wordOccuranceMap.containsKey(wordEntry)) {
				this.wordOccuranceMap.computeIfPresent(wordEntry, (k, v) -> v + 1);
			} else {
				this.wordOccuranceMap.put(wordEntry, 1);
			}
			this.wordCount++;
		}
	}
	
	private String[] cleanWord(String word) {
		return word.replaceAll("[^a-zA-Z0-9]", "").split(" ");
	}

	public String getFileName() {
		return fileName;
	}

	public Map<String, Integer> getWordOccuranceMap() {
		return wordOccuranceMap;
	}
	
	public String toStringWordOccuranceMap() {
		StringBuilder stringBuilder = new StringBuilder();
		for (Map.Entry<String, Integer> entry : this.wordOccuranceMap.entrySet()) {
			stringBuilder.append(entry.getKey() + " : " + entry.getValue() + "\n");
		}
		return stringBuilder.toString();
	}

	public int getWordCount() {
		return wordCount;
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
