import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";


actor {
  // Initialize access control system state
  let accessControlState = AccessControl.initState();
  // Mixin access control system functions
  include MixinAuthorization(accessControlState);
  // Include blob storage (for images, etc)
  include MixinStorage();

  type CoupleInfo = {
    partner1Name : Text;
    partner2Name : Text;
    anniversaryDate : Text;
    tagline : Text;
  };

  type TimelineMilestone = {
    title : Text;
    description : Text;
    date : Text;
  };

  type LoveLetter = {
    author : Text;
    recipient : Text;
    content : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  var coupleInfo : CoupleInfo = {
    partner1Name = "Jeeya";
    partner2Name = "Anuj";
    anniversaryDate = "September 25, 2025";
    tagline = "Six months of love, laughter, and forever in the making";
  };

  var loveLetter : LoveLetter = {
    author = "Anuj";
    recipient = "Jeeya";
    content = "My dearest Jeeya,\n\nIt's been six incredible months since that magical day on September 25. These months have been filled with love, laughter, and memories I will forever cherish. Thank you for saying yes to a lifetime of happiness together. I love you endlessly.\n\nForever yours,\nAnuj";
  };

  var timelineMilestones : [TimelineMilestone] = [
    {
      title = "The Proposal";
      description = "On September 25, 2025, Anuj asked the most important question - and Jeeya said yes.";
      date = "September 25, 2025";
    },
    {
      title = "First Month Together";
      description = "October 2025 marked the beginning of their incredible journey.";
      date = "October 2025";
    },
    {
      title = "Holiday Season Together";
      description = "Celebrated a magical holiday season together in December 2025.";
      date = "December 2025";
    },
    {
      title = "6 Month Anniversary";
      description = "March 25, 2026 marks half a year of love, laughter, and growth.";
      date = "March 25, 2026";
    },
  ];

  var reasonsList : [Text] = [
    "Your beautiful smile",
    "Your warmth and kindness",
    "The way you make ordinary moments extraordinary",
    "Being my best friend and confidant",
    "Your unwavering support",
    "Our inside jokes and laughter",
    "The love you give unconditionally",
    "The future we are building together",
  ];

  var backgroundMusicKey : ?Storage.ExternalBlob = null;

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public query functions - accessible to everyone including guests
  public query ({ caller }) func getCoupleInfo() : async CoupleInfo {
    coupleInfo;
  };

  public query ({ caller }) func getLoveLetter() : async LoveLetter {
    loveLetter;
  };

  public query ({ caller }) func getTimelineMilestones() : async [TimelineMilestone] {
    timelineMilestones;
  };

  public query ({ caller }) func getReasonsList() : async [Text] {
    reasonsList;
  };

  public query ({ caller }) func getBackgroundMusicKey() : async ?Storage.ExternalBlob {
    backgroundMusicKey;
  };

  // Admin-only update functions
  public shared ({ caller }) func updateCoupleInfo(newInfo : CoupleInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can update couple information");
    };
    coupleInfo := newInfo;
  };

  public shared ({ caller }) func updateLoveLetter(newLetter : LoveLetter) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update love letters");
    };
    loveLetter := newLetter;
  };

  public shared ({ caller }) func updateTimelineMilestones(newMilestones : [TimelineMilestone]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update milestones");
    };
    timelineMilestones := newMilestones;
  };

  public shared ({ caller }) func updateReasonsList(newReasons : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update reason list");
    };
    reasonsList := newReasons;
  };

  public shared ({ caller }) func setBackgroundMusicKey(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update background music");
    };
    backgroundMusicKey := ?blob;
  };
};
