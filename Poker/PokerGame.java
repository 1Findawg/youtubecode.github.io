import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Scanner;

public class PokerGame {
	private ArrayList<Player> playerList;
	private StandardDeck gameDeck;
	private StandardCard[] communityCards;
	private int winningPot;
	private int smallBlind;
	private int bigBlind;
	private Player dealer;
	private Player playerSmallBlind;
	private Player playerBigBlind;
	private int[] playersTotalBets;
	private boolean keepPlaying;
	Scanner scan = new Scanner(System.in);
	
	public PokerGame(int smallBlind) {
		this.playerList = new ArrayList<Player>();
		this.gameDeck = new StandardDeck();
		this.communityCards = new StandardCard[5];
		this.winningPot = 0;
		this.smallBlind = smallBlind;
		this.bigBlind = this.smallBlind * 2;
		this.keepPlaying = true;
		playerSetup();
		while (this.keepPlaying) {
			// First round of betting (pre-flop)
			bettingRound(true);
			
			System.out.println("1");
			// Deal the flop to the community cards
			dealNextCommunityCard();
			
			System.out.println("2");
			// Second round of betting
			bettingRound(false);
			
			System.out.println("3");
			// Deal the turn (1 more community card)
			dealNextCommunityCard();
			
			System.out.println("4");
			// Third round of betting
			bettingRound(false);
			
			System.out.println("5");
			// Deal the river (last community card)
			dealNextCommunityCard();
			
			System.out.println("6");
			// Determine winner
			findWinner();
			
			System.out.println("7");
			// Rotate dealer, small blind and big blind positions
			rotatePlayerPositions();
			
			System.out.println("Do you want to play another round? (Y/N)");
			if (scan.next().toLowerCase().contains("n")) {
				this.keepPlaying = false;
			}
		}
	}
	
	public void playerSetup() {
		boolean addAnotherPlayer = true;
		while (addAnotherPlayer) {
			addAnotherPlayer = false;
			addPlayer();
			System.out.println("Do you want to add another player? (Y/N)");
			if (scan.next().toLowerCase().contains("y")) {
				addAnotherPlayer = true;
			}
		}
		this.dealer = playerList.get(0);
		if (playerList.size() > 2) {
			this.playerSmallBlind = playerList.get(1);
			this.playerBigBlind = playerList.get(2);
		}
		this.playersTotalBets = new int[playerList.size()];
		payOutBlinds();
	}
	
	public void rotatePlayerPositions() {
		int dealerIndex = this.playerList.indexOf(this.dealer);
		int smallBlindIndex = this.playerList.indexOf(this.playerSmallBlind);
		int bigBlindIndex = this.playerList.indexOf(this.playerBigBlind);
		if (dealerIndex < this.playerList.size()-1) {
			this.dealer = this.playerList.get(dealerIndex+1);
		}
		else {
			this.dealer = this.playerList.get(0);
		}
		if (smallBlindIndex < this.playerList.size()-1) {
			this.playerSmallBlind = this.playerList.get(smallBlindIndex+1);
		}
		else {
			this.playerSmallBlind = this.playerList.get(0);
		}
		if (bigBlindIndex < this.playerList.size()-1) {
			this.playerBigBlind = this.playerList.get(bigBlindIndex+1);
		}
		else {
			this.playerBigBlind = this.playerList.get(0);
		}
	}
	
	public void payOutBlinds() {
		if (this.playerList.size() > 2) {
			this.playerSmallBlind.reduceFromBalance(this.smallBlind);
			this.playersTotalBets[this.playerList.indexOf(playerSmallBlind)] = this.smallBlind;
			this.playerBigBlind.reduceFromBalance(this.bigBlind);
			this.playersTotalBets[this.playerList.indexOf(this.playerBigBlind)] = this.bigBlind;
		}
	}
	
	public void addPlayer() {
		System.out.println("Enter player name:");
		String tempName = scan.next();
		System.out.println("Enter " + tempName + "'s starting balance:");
		int tempBalance = scan.nextInt();
		StandardCard[] tempHoleCards = {gameDeck.getNextCard(), gameDeck.getNextCard()};
		playerList.add(new Player(tempName, tempBalance, tempHoleCards));
		System.out.println(playerList.get(playerList.size()-1).toString());
	}
	
	public void bettingRound(boolean isPreFlop) {
		int startingPlayerIndex; 
		if (isPreFlop) {
			startingPlayerIndex = this.playerList.indexOf(this.playerSmallBlind) + 2;
		}
		else {
			startingPlayerIndex = this.playerList.indexOf(this.playerSmallBlind);
		}
		int currentPlayerIndex = startingPlayerIndex;
		for (int i = 0; i < this.playerList.size(); i++) {
			if (this.playerList.get(currentPlayerIndex).getIsInGame()) {
				currentPlayerIndex = individualBet(currentPlayerIndex);
			}
		}
		while (!areAllBetsEqual()) {
			currentPlayerIndex = individualBet(currentPlayerIndex);
		}
	}
	
	public int individualBet(int currentPlayerIndex) {
		String checkOrCall = areAllBetsEqual() ? "check" : "call";
		printCommunityCards();
		System.out.println("The pot is: " + this.winningPot);
		System.out.println(this.playerList.get(currentPlayerIndex).toString() + 
				"\nDo you want to fold, " + checkOrCall + " or raise?");
		String answer = scan.next();
		if (answer.toLowerCase().contains("fold")) {
			fold(this.playerList.get(currentPlayerIndex));
		}
		else if (answer.toLowerCase().contains("call")) {
			call(this.playerList.get(currentPlayerIndex));
		}
		else if (answer.toLowerCase().contains("raise")) {
			raise(this.playerList.get(currentPlayerIndex));
		}
		// Check will do nothing in the program just moves the index to the next player
		currentPlayerIndex++;
		if (currentPlayerIndex == this.playerList.size()) {
			currentPlayerIndex = 0;
		}
		return currentPlayerIndex;
	}
	
	public boolean areAllBetsEqual() {
		int highestBet = getHighestBet();
		for (int j = 0; j < this.playersTotalBets.length; j++) {
			if (this.playersTotalBets[j] < highestBet && this.playerList.get(j).getIsInGame()) {
				return false;
			}
		}
		return true;
	}
	
	public int getHighestBet() {
		int highestBet = 0;
		for (int i = 0; i < this.playersTotalBets.length; i++) {
			if (this.playersTotalBets[i] > highestBet && this.playerList.get(i).getIsInGame()) {
				highestBet = this.playersTotalBets[i];
			}
		}
		return highestBet;
	}
	
	public void fold(Player player) {
		player.setIsInGame(false);
	}
	
	public void call(Player player) {
		int highestBet = getHighestBet();
		int playersBetDifference = highestBet - (this.playersTotalBets[this.playerList.indexOf(player)]);
		player.reduceFromBalance(playersBetDifference);
		this.playersTotalBets[this.playerList.indexOf(player)] += playersBetDifference;
		updateWinningPot();
	}
	
	public void raise(Player player) {
		System.out.println(player.getName() + ": How much do you want to raise?");
		int raiseAmount = scan.nextInt();
		call(player);
		player.reduceFromBalance(raiseAmount);
		this.playersTotalBets[this.playerList.indexOf(player)] += raiseAmount;
		updateWinningPot();
	}
	
	public void updateWinningPot() {
		this.winningPot = 0;
		for (int i = 0; i < this.playersTotalBets.length; i++) {
			this.winningPot += this.playersTotalBets[i];
		}
	}
	
	public void dealNextCommunityCard() {
		if (this.communityCards[0] == null) { // Flop
			this.communityCards[0] = this.gameDeck.getNextCard();
			this.communityCards[1] = this.gameDeck.getNextCard();
			this.communityCards[2] = this.gameDeck.getNextCard();
		}
		else if (this.communityCards[3] == null) { // Turn
			this.communityCards[3] = this.gameDeck.getNextCard();
		}
		else if (this.communityCards[4] == null) {
			this.communityCards[4] = this.gameDeck.getNextCard();
		}
	}
	
	public void printCommunityCards() {
		System.out.println("-----------------------------------------------------");
		if (this.communityCards[0] != null && this.communityCards[3] == null && this.communityCards[4] == null) { // Flop
			System.out.println("The flop:");
		}
		else if (this.communityCards[3] != null && this.communityCards[4] == null) { // Turn
			System.out.println("The turn:");
		}
		else if (this.communityCards[4] != null) {
			System.out.println("The river:");
		}
		System.out.println(Arrays.toString(this.communityCards));
		System.out.println("-----------------------------------------------------");
	}
	
	public void findWinner() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		//royalFlush
		winningPlayers = royalFlush();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		//straightFlush
		winningPlayers = straightFlush();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		//fourOfAKind
		winningPlayers = fourOfAKind();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		//fullHouse
		winningPlayers = fullHouse();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		//flush
		winningPlayers = flush();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		//straight
		winningPlayers = straight();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		//threeOfAKind
		winningPlayers = threeOfAKind();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		//twoPair
		winningPlayers = twoPair();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		//onePair
		winningPlayers = onePair();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		//highCard
		winningPlayers = highCard();
		if (winningPlayers.size() > 0) {
			handleWinners(winningPlayers);
			return;
		}
		System.out.println("Winner(s) are: " + winningPlayers);
	}
	
	public void handleWinners(ArrayList<Player> winningPlayers) {
		int tempWinnerAward = this.winningPot / winningPlayers.size();
		for (int i = 0; i < winningPlayers.size(); i++) {
			winningPlayers.get(i).addToBalance(tempWinnerAward);
		}
		this.winningPot = 0;
	}
	
	public ArrayList<Player> royalFlush() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		for (int i = 0; i < this.playerList.size(); i++) {
			int hearts = 0;
			int diamonds = 0;
			int spades = 0;
			int clubs = 0;
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				ArrayList<Integer> tempPlayerCards = new ArrayList<Integer>();
				ArrayList<StandardCard> tempPlayersCardsAll = tempPlayersCardsAll(tempPlayer);
				for (int l = 0; l < tempPlayersCardsAll.size(); l++) {
					if (tempPlayersCardsAll.get(l).getSuit().contains("Hearts")) {
						hearts++;
					}
					if (tempPlayersCardsAll.get(l).getSuit().contains("Diamonds")) {
						diamonds++;
					}
					if (tempPlayersCardsAll.get(l).getSuit().contains("Spades")) {
						spades++;
					}
					if (tempPlayersCardsAll.get(l).getSuit().contains("Clubs")) {
						clubs++;
					}
				}
				if (hearts >= 5) {
					tempPlayerCards = getValuesOfSuit(tempPlayersCardsAll, "Hearts");
				}
				else if (diamonds >= 5) {
					tempPlayerCards = getValuesOfSuit(tempPlayersCardsAll, "Diamonds");
				}
				else if (spades >= 5) {
					tempPlayerCards = getValuesOfSuit(tempPlayersCardsAll, "Spades");
				}
				else if (clubs >= 5) {
					tempPlayerCards = getValuesOfSuit(tempPlayersCardsAll, "Clubs");
				}
				
				if (tempPlayerCards.contains(10) &&
						tempPlayerCards.contains(11) &&
						tempPlayerCards.contains(12) &&
						tempPlayerCards.contains(13) &&
						tempPlayerCards.contains(14)) {
					winningPlayers.add(tempPlayer);
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<Player> straightFlush() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		for (int i = 0; i < this.playerList.size(); i++) {
			int hearts = 0;
			int diamonds = 0;
			int spades = 0;
			int clubs = 0;
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				ArrayList<Integer> tempPlayerCards = new ArrayList<Integer>();
				ArrayList<StandardCard> tempPlayersCardsAll = tempPlayersCardsAll(tempPlayer);
				for (int l = 0; l < tempPlayersCardsAll.size(); l++) {
					if (tempPlayersCardsAll.get(l).getSuit().contains("Hearts")) {
						hearts++;
					}
					if (tempPlayersCardsAll.get(l).getSuit().contains("Diamonds")) {
						diamonds++;
					}
					if (tempPlayersCardsAll.get(l).getSuit().contains("Spades")) {
						spades++;
					}
					if (tempPlayersCardsAll.get(l).getSuit().contains("Clubs")) {
						clubs++;
					}
				}
				if (hearts >= 5) {
					tempPlayerCards = getValuesOfSuit(tempPlayersCardsAll, "Hearts");
				}
				else if (diamonds >= 5) {
					tempPlayerCards = getValuesOfSuit(tempPlayersCardsAll, "Diamonds");
				}
				else if (spades >= 5) {
					tempPlayerCards = getValuesOfSuit(tempPlayersCardsAll, "Spades");
				}
				else if (clubs >= 5) {
					tempPlayerCards = getValuesOfSuit(tempPlayersCardsAll, "Clubs");
				}
				Collections.sort(tempPlayerCards);
				int lowestValue = 15;
				int secondHighestValue = 15;
				int thirdHighestValue = 15;
				if (tempPlayerCards.size() >= 5) {
					lowestValue = tempPlayerCards.get(0);
					secondHighestValue = tempPlayerCards.get(1);
					thirdHighestValue = tempPlayerCards.get(2);
					if(tempPlayerCards.contains(lowestValue + 1) && 
							tempPlayerCards.contains(lowestValue + 2) &&
							tempPlayerCards.contains(lowestValue + 3) &&
							tempPlayerCards.contains(lowestValue + 4)) {
							winningPlayers.add(tempPlayer);
					}
				}
				if (tempPlayerCards.size() >= 6) {
					if(tempPlayerCards.contains(secondHighestValue + 1) && 
							tempPlayerCards.contains(secondHighestValue + 2) &&
							tempPlayerCards.contains(secondHighestValue + 3) &&
							tempPlayerCards.contains(secondHighestValue + 4)) {
							winningPlayers.add(tempPlayer);
					}
				}
				if (tempPlayerCards.size() >= 7) {
					if(tempPlayerCards.contains(thirdHighestValue + 1) && 
							tempPlayerCards.contains(thirdHighestValue + 2) &&
							tempPlayerCards.contains(thirdHighestValue + 3) &&
							tempPlayerCards.contains(thirdHighestValue + 4)) {
							winningPlayers.add(tempPlayer);
					}
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<Player> fourOfAKind() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		for (int i = 0; i < this.playerList.size(); i++) {
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				int [] allValues = new int[13];
				ArrayList<StandardCard> tempPlayersCardsAll = tempPlayersCardsAll(tempPlayer);
				for (int j = 0; j < tempPlayersCardsAll.size(); j++) {
					allValues[tempPlayersCardsAll.get(j).getValue()-2]++;
				}
				for (int k = 0; k < allValues.length; k++) {
					if (allValues[k] >= 4) {
						winningPlayers.add(tempPlayer);
					}
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<Player> fullHouse() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		for (int i = 0; i < this.playerList.size(); i++) {
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				int [] allValues = new int[13];
				boolean threeCard = false;
				boolean twoCard = false;

				ArrayList<StandardCard> tempPlayersCardsAll = tempPlayersCardsAll(tempPlayer);
				for (int j = 0; j < tempPlayersCardsAll.size(); j++) {
					allValues[tempPlayersCardsAll.get(j).getValue()-2]++;
				}
				for (int k = 0; k < allValues.length; k++) {
					if (allValues[k] >= 3) {
						threeCard = true;
					}
					else if (allValues[k] >= 2) {
						twoCard = true;
					}
				}
				if (threeCard && twoCard) {
					winningPlayers.add(tempPlayer);
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<Player> flush() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		for (int i = 0; i < this.playerList.size(); i++) {
			int hearts = 0;
			int diamonds = 0;
			int spades = 0;
			int clubs = 0;
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				ArrayList<StandardCard> tempPlayersCardsAll = tempPlayersCardsAll(tempPlayer);
				for (int l = 0; l < tempPlayersCardsAll.size(); l++) {
					if (tempPlayersCardsAll.get(l).getSuit().contains("Hearts")) {
						hearts++;
					}
					if (tempPlayersCardsAll.get(l).getSuit().contains("Diamonds")) {
						diamonds++;
					}
					if (tempPlayersCardsAll.get(l).getSuit().contains("Spades")) {
						spades++;
					}
					if (tempPlayersCardsAll.get(l).getSuit().contains("Clubs")) {
						clubs++;
					}
				}
				if (hearts >= 5 || diamonds >= 5 || spades >= 5 || clubs >= 5) {
					winningPlayers.add(tempPlayer);
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<Player> straight() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		for (int i = 0; i < this.playerList.size(); i++) {
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				ArrayList<StandardCard> tempPlayersCardsAll = tempPlayersCardsAll(tempPlayer);
				ArrayList<Integer> tempPlayerCards = getValuesOfAllCards(tempPlayersCardsAll);
				
				Collections.sort(tempPlayerCards);
				int lowestValue = 15;
				int secondHighestValue = 15;
				int thirdHighestValue = 15;
				if (tempPlayerCards.size() >= 5) {
					lowestValue = tempPlayerCards.get(0);
					secondHighestValue = tempPlayerCards.get(1);
					thirdHighestValue = tempPlayerCards.get(2);
					if(tempPlayerCards.contains(lowestValue + 1) && 
							tempPlayerCards.contains(lowestValue + 2) &&
							tempPlayerCards.contains(lowestValue + 3) &&
							tempPlayerCards.contains(lowestValue + 4)) {
							winningPlayers.add(tempPlayer);
					}
				}
				if (tempPlayerCards.size() >= 6) {
					if(tempPlayerCards.contains(secondHighestValue + 1) && 
							tempPlayerCards.contains(secondHighestValue + 2) &&
							tempPlayerCards.contains(secondHighestValue + 3) &&
							tempPlayerCards.contains(secondHighestValue + 4)) {
							winningPlayers.add(tempPlayer);
					}
				}
				if (tempPlayerCards.size() >= 7) {
					if(tempPlayerCards.contains(thirdHighestValue + 1) && 
							tempPlayerCards.contains(thirdHighestValue + 2) &&
							tempPlayerCards.contains(thirdHighestValue + 3) &&
							tempPlayerCards.contains(thirdHighestValue + 4)) {
							winningPlayers.add(tempPlayer);
					}
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<Player> threeOfAKind() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		for (int i = 0; i < this.playerList.size(); i++) {
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				int [] allValues = new int[13];
				ArrayList<StandardCard> tempPlayersCardsAll = tempPlayersCardsAll(tempPlayer);
				for (int j = 0; j < tempPlayersCardsAll.size(); j++) {
					allValues[tempPlayersCardsAll.get(j).getValue()-2]++;
				}
				for (int k = 0; k < allValues.length; k++) {
					if (allValues[k] >= 3) {
						winningPlayers.add(tempPlayer);
					}
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<Player> twoPair() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		for (int i = 0; i < this.playerList.size(); i++) {
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				int [] allValues = new int[13];
				int pairCount = 0;
				ArrayList<StandardCard> tempPlayersCardsAll = tempPlayersCardsAll(tempPlayer);
				for (int j = 0; j < tempPlayersCardsAll.size(); j++) {
					allValues[tempPlayersCardsAll.get(j).getValue()-2]++;
				}
				for (int k = 0; k < allValues.length; k++) {
					if (allValues[k] >= 2) {
						pairCount++;
						if (pairCount == 2) {
							winningPlayers.add(tempPlayer);
						}
					}
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<Player> onePair() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		for (int i = 0; i < this.playerList.size(); i++) {
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				int [] allValues = new int[13];
				ArrayList<StandardCard> tempPlayersCardsAll = tempPlayersCardsAll(tempPlayer);
				for (int j = 0; j < tempPlayersCardsAll.size(); j++) {
					allValues[tempPlayersCardsAll.get(j).getValue()-2]++;
				}
				for (int k = 0; k < allValues.length; k++) {
					if (allValues[k] >= 2 && !winningPlayers.contains(tempPlayer)) {
						winningPlayers.add(tempPlayer);
					}
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<Player> highCard() {
		ArrayList<Player> winningPlayers = new ArrayList<Player>();
		int[][] sortedPlayersHoleCards = new int[this.playerList.size()][2];
		// The first highest card
		int highestCardColTwo = 0;
		// The second highest card
		int highestCardColOne = 0;
		boolean tie = false;
		
		for (int i = 0; i < this.playerList.size(); i++) {
			Player tempPlayer = this.playerList.get(i);
			if (tempPlayer.getIsInGame()) {
				ArrayList<Integer> tempHoleCards = new ArrayList<Integer>();
				tempHoleCards.add(tempPlayer.getHoleCards()[0].getValue());
				tempHoleCards.add(tempPlayer.getHoleCards()[1].getValue());
				Collections.sort(tempHoleCards);
				if (tempHoleCards.get(1) > highestCardColTwo) {
					highestCardColTwo = tempHoleCards.get(1);
					winningPlayers.clear();
					winningPlayers.add(tempPlayer);
					sortedPlayersHoleCards = new int[this.playerList.size()][2];
					sortedPlayersHoleCards[i][0] = i;
					sortedPlayersHoleCards[i][1] = tempHoleCards.get(0);
				}
				else if (tempHoleCards.get(1) == highestCardColTwo) {
					winningPlayers.add(tempPlayer);
					tie = true;
					// Saves the index of the player and the value of the players second highest card
					sortedPlayersHoleCards[i][0] = i;
					sortedPlayersHoleCards[i][1] = tempHoleCards.get(0);
				}
			}
		}
		if (tie) {
			winningPlayers.clear();
			for (int k = 0; k < sortedPlayersHoleCards.length; k++) {
				if (sortedPlayersHoleCards[k][1] > highestCardColOne) {
					highestCardColOne = sortedPlayersHoleCards[k][1];
				}
			}
			for (int l = 0; l < sortedPlayersHoleCards.length; l++) {
				if (sortedPlayersHoleCards[l][1] == highestCardColOne) {
					winningPlayers.add(this.playerList.get(l));
				}
			}
		}
		return winningPlayers;
	}
	
	public ArrayList<StandardCard> tempPlayersCardsAll(Player player) {
		ArrayList<StandardCard> result = new ArrayList<StandardCard>();
		for (int i = 0; i < this.communityCards.length; i++) {
			result.add(this.communityCards[i]);
		}
		result.add(player.getHoleCards()[0]);
		result.add(player.getHoleCards()[1]);
		return result;
	}
	
	public ArrayList<Integer> getValuesOfSuit(ArrayList<StandardCard> playersCardsAll, String suit) {
		ArrayList<Integer> result = new ArrayList<Integer>();
		for (int i = 0; i < playersCardsAll.size(); i++) {
			if (playersCardsAll.get(i).getSuit().contains(suit)) {
				result.add(playersCardsAll.get(i).getValue());
			}
		}
		return result;
	}
	
	public ArrayList<Integer> getValuesOfAllCards(ArrayList<StandardCard> playersCardsAll) {
		ArrayList<Integer> result = new ArrayList<Integer>();
		for (int i = 0; i < playersCardsAll.size(); i++) {
			result.add(playersCardsAll.get(i).getValue());
		}
		return result;
	}

	public static void main(String[] args) {
		/*
		 * List of players - add them during runtime - Done
		 * Small Blind and Big blind - Done
		 * A shuffled deck - Done
		 * The pot - Done
		 * Community cards -Done
		 * Turn controller - Done
		 * 	bet
		 * 	check
		 * 	fold
		 * Winning hand checks 1-10
		 * 
		 */
		
		PokerGame pg = new PokerGame(1);
		pg.playerList.add(new Player("Scott", 0, new StandardCard[] {new StandardCard(4,"Hearts"),new StandardCard(10,"Diamonds")}));
		pg.playerList.add(new Player("1Findawg", 0, new StandardCard[] {new StandardCard(10,"Hearts"),new StandardCard(5,"Diamonds")}));
		pg.playerList.add(new Player("Jack", 0, new StandardCard[] {new StandardCard(2,"Hearts"),new StandardCard(3,"Diamonds")}));
		pg.communityCards = new StandardCard[] {
				new StandardCard(11,"Hearts"),
				new StandardCard(9,"Hearts"),
				new StandardCard(2,"Spades"),
				new StandardCard(8,"Hearts"),
				new StandardCard(13,"Spades")};
//		pg.royalFlush();
//		pg.straightFlush();
//		pg.fourOfAKind();
//		pg.fullHouse();
//		pg.flush();
//		pg.straight();
//		pg.threeOfAKind();
//		pg.twoPair();
//		pg.onePair();
//		pg.highCard();
		
//		ArrayList<StandardCard> testHand = new ArrayList<StandardCard>();
//		testHand.add(new StandardCard(2,"Hearts"));
//		testHand.add(new StandardCard(10,"Diamonds"));
//		testHand.add(new StandardCard(5,"Hearts"));
//		testHand.add(new StandardCard(9,"Spades"));
//		testHand.add(new StandardCard(13,"Hearts"));
//		testHand.add(new StandardCard(2,"Clubs"));
//		testHand.add(new StandardCard(4,"Clubs"));
//		System.out.println(pg.sortLowToHighCards(testHand));

	}

}
