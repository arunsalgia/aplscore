

module.exports = (mongoose) => {
  
  const TournamentSchema = mongoose.Schema({
    name: String,
    cricTid: String,
    desc: String,
    type: String,
    started: Boolean,
    over: Boolean,
    seriesId: String,
    enabled: Boolean
  });
  
  //--- data available from CRICAPI
  CricapiMatchSchema = mongoose.Schema({
    mid: Number,
    apiMatchId: String,
    cricMid: String,
    tournament: String,
    team1: String,
    team2: String,
    // team1Description:String,
    // team2Description:String,
    weekDay: String,
    type: String,
    matchStarted: Boolean,
    matchEnded: Boolean,
    matchStartTime: Date,
    matchEndTime: Date,
    squad: Boolean
  })
  
	const UserSchema = mongoose.Schema({
  uid: Number,
  userName: String,
  displayName: String,
  password: String,
  status: Boolean,
  defaultGroup: Number,
  email: String,
  userPlan: Number,
  mobile: String,
  showGuide: Boolean,
  currentGuide: Number,
	currency: String
});

	const GroupSchema = mongoose.Schema({
  gid: Number,
  name: String,
  owner: Number,
  maxBidAmount: Number,
  tournament: String,
  auctionStatus: String,
  auctionPlayer: Number,
  auctionBid: Number,
  currentBidUid: Number,
  currentBidUser: String,
  memberCount: Number,
  memberFee: Number,
  prizeCount: Number,
  enable: Boolean,
	maxPlayers: Number
	});
	
	const GroupMemberSchema = mongoose.Schema({
		gid: Number,
		uid: Number,
		userName: String,
		balanceAmount: Number,        // balance available to be used for bid
		displayName: String,
		score: Number,
		rank: Number,
		prize: Number,
		enable: Boolean,
		// breakup of fees paid by user
		walletFee: Number,
		bonusFee: Number
	});
	
	const PlayerSchema = mongoose.Schema({
		pid: Number,
    cricPid: String,
		name: String,
		fullName: String,
		Team: String,
		role: String,
		bowlingStyle: String,
		battingStyle: String,
		tournament: String
	});
	
	const AuctionSchema = mongoose.Schema({
		gid: Number,
		uid: Number,
		pid: Number,
    cricPid: String,
		team: String,
		role: String,
		playerName: String,
		bidAmount: Number
	});

	
	return {
    TournamentSchema,
    CricapiMatchSchema,
		UserSchema,
		GroupSchema,
		GroupMemberSchema,
		PlayerSchema,
		AuctionSchema,
	}

}

