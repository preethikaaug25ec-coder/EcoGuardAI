const streets = JSON.parse(
        document.getElementById("ecoGuardData").textContent
    );
    const hotspotZones = JSON.parse(
        document.getElementById("hotspotData")?.textContent || "[]"
    );
    const priorityZones = hotspotZones.length ? hotspotZones : streets;

    const translations = {
        en: {
            workspace: "Workspace", overview: "Overview", analytics: "Analytics",
            riskMonitoring: "Risk monitoring", simulator: "What-If Simulator",
            streets: "Street locations", environment: "Environmental impact",
            howItWorks: "How it works", smallChanges: "Small changes matter",
            sidebarNote: "Timely waste collection and better organic waste handling can support cleaner neighbourhoods.",
            controlCenter: "Environmental control center",
            dashboardTitle: "Smart Waste Dashboard",
            dashboardSubtitle: "Monitor waste conditions, compare street-level risk, and explore possible interventions.",
            demoMode: "Demo data mode", heroTag: "Climate action • Smart cities",
            heroTitle: "A cleaner city starts with smarter waste decisions.",
            heroDescription: "EcoGuard AI helps prioritise waste collection by examining illustrative waste quantities, organic waste, and collection delays. Use the simulator to explore how conditions may change a rule-based risk score.",
            trySimulator: "Try the What-If Simulator", citySnapshot: "City snapshot",
            snapshotSubtitle: "Summary of the demonstration streets currently in the dashboard.",
            prototype: "Prototype", totalWaste: "Total waste units",
            acrossStreets: "Across monitored streets", organicWaste: "Organic waste units",
            needsAttention: "Requires appropriate handling", highRiskStreets: "High-risk streets",
            prioritiseCollection: "Consider prioritising collection", monitoredStreets: "Monitored streets",
            sampleRecords: "Illustrative sample records", wasteAnalytics: "Waste quantity analytics",
            chartSubtitle: "Compare total and organic waste by street.", sampleData: "Sample data",
            riskMonitorTitle: "Risk priority monitor",
            riskMonitorSubtitle: "Street conditions ranked by the prototype scoring rules.",
            high: "High risk", medium: "Medium", low: "Low",
            simulatorHeading: "What-If Simulator",
            simulatorSubtitle: "Change a street's conditions and see how the rule-based risk score responds.",
            simulateTitle: "Explore a better collection decision",
            simulateDescription: "Adjust the inputs below. Your experiment changes only the simulation, not the original dashboard records.",
            selectStreet: "Select street", wasteQuantity: "Total waste quantity",
            illustrativeUnits: "Illustrative units", organicQuantity: "Organic waste quantity",
            organicMustFit: "Cannot exceed total waste", collectionDelay: "Collection delay",
            noDelay: "No delay", resetScenario: "Reset to street values",
            estimatedRiskScore: "Estimated risk score", calculating: "Calculating scenario...",
            recommendedActions: "Recommended actions",
            simNote: "This is a demonstration score based on simple rules. It does not measure methane, forecast actual emissions, or replace an environmental assessment.",
            streetMonitoring: "Street monitoring",
            streetSubtitle: "Search and compare the example street records.",
            searchPlaceholder: "Search streets...", exportCsv: "Export CSV",
            streetName: "STREET", wasteCol: "WASTE", organicCol: "ORGANIC",
            delayCol: "DELAY (DAYS)", scoreCol: "RISK SCORE", levelCol: "RISK LEVEL",
            environmentTitle: "Environmental impact priorities",
            environmentSubtitle: "Practical actions that support more responsible waste management.",
            organicTitle: "Organic waste handling",
            organicText: "Separate biodegradable waste and consider suitable composting or anaerobic digestion systems operated safely.",
            collectionTitle: "Timely collection",
            collectionText: "Use local observations and collection records to prioritise streets with accumulating waste or repeated delays.",
            climateTitle: "Climate awareness",
            climateText: "Organic waste can generate methane under oxygen-limited decomposition. Proper waste handling can help reduce avoidable emissions.",
            workflowTitle: "How EcoGuard AI works",
            workflowSubtitle: "A simple prototype workflow that can later connect to verified municipal data.",
            stepOneTitle: "Collect inputs",
            stepOneText: "Use example waste quantities, organic waste amounts, and collection delays.",
            stepTwoTitle: "Calculate score",
            stepTwoText: "Apply transparent thresholds to create an illustrative risk score.",
            stepThreeTitle: "Compare scenarios",
            stepThreeText: "Change simulator inputs and compare the new score with the original street record.",
            stepFourTitle: "Plan action",
            stepFourText: "Review suggested collection priorities and validate decisions with real-world observations.",
            importantNote: "Important prototype note:",
            disclaimer: "The dashboard uses fictional demonstration data and a rule-based scoring method. Risk scores are not measured methane levels, validated predictions, or verified emission reductions. A production system would need reliable field data, environmental validation, and appropriate privacy and safety controls.",
            smartWaste: "Smart waste management prototype",
            builtFor: "Designed for cleaner, more informed cities.",
            days: "days", originalScore: "Original score",
            scenarioScore: "Scenario score", noChange: "No change from the original score.",
            increased: "Risk score increased by", decreased: "Risk score decreased by",
            points: "points", riskHigh: "High", riskMedium: "Medium", riskLow: "Low",
            noResults: "No matching streets found.", csvDownloaded: "CSV file exported.",
            simulationError: "Could not calculate the scenario. Please try again.",
            loading: "Calculating...", scoreLower: "The score is lower than the original record.",
            scoreHigher: "The score is higher than the original record.",
            sameScore: "The score matches the original record.",
            originalNotFound: "No original street record is available for comparison.",
            wasteLabel: "Waste", organicLabel: "Organic", delayLabel: "Delay",
            complaintsNav: "Citizen complaints", trackingNav: "Track a complaint",
            complaintsHeading: "Citizen complaints",
            complaintsSubtitle: "Report local waste concerns and review recent community reports.",
            municipalityNav: "Municipality management",
            municipalityTitle: "Municipality management",
            municipalityDescription: "Add, review, and maintain collection locations across the city.",
            locationDetailTitle: "Location detail",
            locationDetailDescription: "Review current risk, complaints, and operational notes.",
            locationProfileSubtitle: "Operational profile and risk details for this collection zone.",
            backToLocations: "Back to locations",
            riskScore: "Risk score",
            riskLevel: "{level} risk level",
            riskLevelSuffix: "risk level",
            wasteUnit: "kg/day",
            organicShare: "Organic share",
            organicWastePercentage: "Organic waste percentage",
            collectionInterval: "Collection interval",
            locationInformation: "Location information",
            typeLabel: "Type",
            coordinates: "Coordinates",
            lastCollection: "Last collection",
            fillLevel: "Fill level",
            segregationEfficiency: "Segregation efficiency",
            statusLabel: "Status",
            dataSource: "Data source",
            unavailable: "Unavailable",
            notProvided: "Not provided",
            recommendedActions: "Recommended actions",
            continueMonitoring: "Continue monitoring",
            reviewScheduling: "Review collection scheduling",
            prioritiseCollectionAction: "Prioritise collection",
            riskMethodNote: "Risk calculations use the same transparent rule-based logic used elsewhere in the application. They do not represent calibrated methane measurements.",
            relatedComplaints: "Related complaints",
            relatedComplaintsDescription: "Historical complaint records tied to this location.",
            noComplaintHistory: "No complaint history was found for this location.",
            locationNameValidation: "Location name must be between 2 and 120 characters.",
            locationTypeValidation: "Please choose a valid location type.",
            wardRequiredValidation: "Ward or zone is required.",
            locationNumbersValidation: "Waste, organic content, and collection frequency must be valid numbers.",
            wasteNegativeValidation: "Estimated total waste cannot be negative.",
            organicRangeValidation: "Organic waste percentage must be between 0 and 100.",
            collectionFrequencyValidation: "Collection frequency must be a positive number of days.",
            coordinatesNumericValidation: "Latitude and longitude must be numeric values.",
            coordinatesPairValidation: "Latitude and longitude must be provided together.",
            coordinatesRangeValidation: "Coordinates are outside the valid Earth range.",
            fillNumericValidation: "Fill level percentage must be numeric.",
            fillRangeValidation: "Fill level percentage must be between 0 and 100.",
            segregationNumericValidation: "Segregation efficiency must be numeric.",
            segregationRangeValidation: "Segregation efficiency must be between 0 and 100.",
            collectionDateValidation: "Last collection date must be a valid ISO date or timestamp.",
            notesLengthValidation: "Notes must be 500 characters or fewer.",
            duplicateLocation: "A location with a similar name already exists.",
            locationIdRequired: "A valid location ID is required to edit a record.",
            locationNotFound: "That location could not be found.",
            locationAdded: "Location added successfully.",
            locationUpdated: "Location updated successfully.",
            locationDeactivated: "{name} has been deactivated without deleting its historical records.",
            locationDeactivateFailed: "The location could not be deactivated.",
            locationDetailNotFound: "Location not found.",
            municipalityPageTitle: "Municipality location management",
            municipalityPageSubtitle: "Review active collection zones and add new municipal locations to the shared operational database.",
            liveDatabase: "Live database",
            totalLocations: "Total locations",
            totalLocationsFoot: "Registered operational sites",
            activeLocations: "Active",
            activeLocationsFoot: "Available for routing and risk analysis",
            highRiskLocations: "High-risk",
            highRiskFoot: "Priority collection candidates",
            needsAttentionLocations: "Needs attention",
            needsAttentionFoot: "Review collection frequency and fill levels",
            addNewLocationTitle: "Add a new location",
            addNewLocationSubtitle: "Store location data in SQLite so it is immediately available across the platform.",
            locationName: "Location name",
            locationNamePlaceholder: "Anna Nagar Junction",
            locationTypeLabel: "Location type",
            locationTypeJunction: "Junction",
            locationTypeStreet: "Street",
            locationTypeWard: "Ward",
            locationTypeMarket: "Market",
            locationTypeResidential: "Residential area",
            locationTypeOther: "Other",
            overflowConfirmation: "Deactivate this location? Historical records remain available.",
            wardOrZone: "Ward or zone identifier",
            wardOrZonePlaceholder: "Ward 12",
            estimatedWasteField: "Estimated total waste (kg/day)",
            organicWasteField: "Organic waste (%)",
            collectionFrequencyField: "Collection frequency (days)",
            latitudeLabel: "Latitude",
            longitudeLabel: "Longitude",
            lastCollectionField: "Last collection date and time",
            fillLevelField: "Fill level (%)",
            overflowHistoryField: "Overflow incidents",
            overflowHistoryPlaceholder: "e.g. 2 moderate overflows",
            segregationEfficiencyField: "Segregation efficiency (%)",
            notesLabel: "Notes",
            notesPlaceholder: "Optional operational observations",
            addLocationButton: "Add location",
            registeredLocationsTitle: "Registered locations",
            registeredLocationsSubtitle: "Search, review, and deactivate locations without deleting historical records.",
            searchLocationPlaceholder: "Search by location name",
            searchLocations: "Search locations",
            filterStatus: "Filter by status",
            allStatuses: "All statuses",
            statusActive: "Active",
            statusInactive: "Inactive",
            applyFilters: "Apply filters",
            detailAction: "Detail",
            deactivateAction: "Deactivate",
            deactivateConfirm: "Deactivate this location? Historical records remain available.",
            noLocationsMatch: "No locations match the current search or filter.",
            adminLink: "Administrator sign in", totalComplaints: "Total complaints",
            pendingComplaints: "Pending complaints", resolvedComplaints: "Resolved complaints",
            communityReports: "Community reports received", awaitingReview: "Awaiting review or action",
            completedReports: "Marked as resolved", submitReport: "Submit a waste report",
            formHelp: "Provide enough detail for the local team to identify and review the issue.",
            citizenName: "Your name", complaintStreet: "Street or neighbourhood",
            categoryLabel: "Waste problem category", chooseCategory: "Choose a category",
            catOverflow: "Overflowing waste", catDumping: "Illegal dumping",
            catMissed: "Missed collection", catMixed: "Mixed or unsorted waste",
            catHazardous: "Hazardous waste", catOther: "Other",
            descriptionLabel: "Description", photoOptional: "Photo (optional)",
            photoHelp: "JPEG, PNG, or WebP; maximum 5 MB.",
            submitComplaint: "Submit complaint", recentReports: "Recent reports",
            recurringIntro: "Streets with two or more reports are listed as recurring.",
            dateLabel: "Date", statusLabel: "Status",
            noReports: "No complaints have been submitted yet.",
            recurringComplaints: "Recurring complaint streets",
            reportsCount: "reports", noRecurring: "No street has multiple reports yet.",
            trackHeading: "Track a complaint",
            trackSubtitle: "Enter the complaint ID you received after submitting a report.",
            complaintId: "Complaint ID", trackButton: "Check status",
            submittedMessage: "Your complaint was submitted. Save this ID:",
            invalidComplaint: "We couldn't find that complaint ID. Check it and try again.",
            trackingDetails: "Complaint details", pendingStatus: "Pending",
            inProgressStatus: "In Progress", resolvedStatus: "Resolved",
            invalidPhoto: "Choose a JPEG, PNG, or WebP photo.",
            photoTooLarge: "Photo must be 5 MB or smaller.",
            requiredFields: "Please enter the required information.",
            adminNav: "Admin management", adminLoginTitle: "Administrator sign in",
            adminLoginDescription: "Sign in with the administrator credentials configured for this installation.",
            adminPageTitle: "Complaint administration",
            adminPageDescription: "Review citizen reports and update their status.",
            signOut: "Sign out", updateStatus: "Update status", saveStatus: "Save",
            analyticsTitle: "Analytics and explainable estimates",
            analyticsDescription: "Compare illustrative waste inputs and inspect transparent rule-based risk estimates.",
            riskPageTitle: "Street-level risk monitoring",
            riskPageDescription: "Review transparent demonstration scores and suggested collection actions.",
            collectionPriorities: "Collection priorities", viewAll: "View all",
            complaintSnapshot: "Complaint snapshot",
            complaintCountsHint: "Current citizen report status counts.",
            manageReports: "Manage reports", recentReportsHint: "Latest reports submitted by citizens.",
            trackNavShort: "Track report",
            riskDistribution: "Street risk distribution",
            riskDistributionDescription: "Counts by the existing transparent score bands.",
            riskDrivers: "How the estimate is formed",
            riskDriversDescription: "Each condition contributes a fixed, inspectable score.",
            wasteRule: "25 points at 70+, 40 points at 100+",
            organicRule: "15 points at 35+, 30 points at 60+",
            delayRule: "15 points at 1 day, 30 points at 2+ days",
            streetEstimates: "Street estimates",
            estimateExplanation: "Scores are capped at 100 and grouped into Low, Medium, and High priority bands.",
            ruleEstimate: "Rule-based estimates",
            estimateDisclaimerTitle: "Estimate, not a forecast:",
            estimateDisclaimer: "These are explainable rule-based estimates from fictional demonstration inputs, not observed trends, methane measurements, trained AI predictions, or future emissions forecasts.",
            recommendationsTitle: "Recommended next actions",
            recommendationsDescription: "Suggestions follow directly from each street's recorded conditions.",
            recommendHigh: "Prioritise collection and inspect promptly.",
            recommendMedium: "Plan collection soon and monitor.",
            recommendLow: "Continue regular collection and monitoring.",
            interactive: "Interactive",
            mapTitle: "Waste hotspot map",
            mapOverviewSubtitle: "High-priority zones and their current action status.",
            mapRiskSubtitle: "Locate zones that need urgent collection attention.",
            mapFilterAll: "All",
            mapLoading: "Loading hotspot map...",
            mapEmpty: "No risk zones match this filter.",
            mapTilesUnavailable: "Map tiles are unavailable. Street priorities are still listed below.",
            mapLibraryUnavailable: "The interactive map library could not be loaded. Street priorities are still listed below.",
            mapLegendHigh: "High risk", mapLegendMedium: "Medium risk", mapLegendLow: "Low risk",
            notificationsTitle: "Notifications", openNotifications: "Open notifications",
            markAllRead: "Mark all read", noNotifications: "No notifications yet.",
            severityInfo: "Info", severityWarning: "Warning", severityUrgent: "Urgent",
            username: "Username", password: "Password", signIn: "Sign in",
            statusForComplaint: "Complaint status",
            selectLanguage: "Choose language",
            highRiskNotificationTitle: "High-risk zone: {zone}",
            highRiskNotificationMessage: "{zone} is high risk. Recommended action: {action}",
            overdueNotificationTitle: "Collection overdue for {zone}",
            overdueNotificationMessage: "Waste collection for {zone} is overdue. Review the schedule and dispatch resources.",
            recurringNotificationTitle: "Recurring issues near {zone}",
            recurringNotificationMessage: "Repeated complaints were recorded near {zone}. Follow-up collection planning may be needed.",
            complaintSubmittedTitle: "New citizen complaint received",
            complaintSubmittedMessage: "A new complaint for {zone} is awaiting review.",
            complaintStatusTitle: "Complaint status updated",
            complaintStatusMessage: "The complaint for {zone} is now marked as {status}.",
            simulationNotificationTitle: "Risk scenario changed for {zone}",
            simulationNotificationMessage: "The simulated risk for {zone} changed significantly. Review this priority.",
            notificationUpdateError: "Could not update notifications. Please try again.",
            notificationInvalidId: "This notification has no valid ID.",
            oversizedRequest: "The uploaded request is too large. Photos must be 5 MB or smaller.",
            complaintSaveFailed: "The complaint could not be saved. Please try again.",
            adminLoginFailed: "Administrator username or password is incorrect.",
            complaintUpdated: "Complaint status updated.",
            nameValidation: "Name must be between 2 and 100 characters.",
            streetValidation: "Street must be between 2 and 120 characters.",
            categoryValidation: "Please select a valid waste problem category.",
            descriptionValidation: "Description must be between 10 and 2000 characters.",
            photoTypeValidation: "Photo must be a JPEG, PNG, or WebP image.",
            photoSizeValidation: "Photo must be 5 MB or smaller.",
            photoMismatch: "The uploaded file does not match a supported photo type.",
            photoStorageError: "The photo could not be stored. Please try again."
        },
        ta: {
            workspace: "பணியிடம்", overview: "கண்ணோட்டம்", analytics: "தரவு பகுப்பாய்வு",
            riskMonitoring: "ஆபத்து கண்காணிப்பு", simulator: "என்ன ஆகும் சோதனை",
            streets: "தெரு விவரங்கள்", environment: "சுற்றுச்சூழல் தாக்கம்",
            howItWorks: "செயல்முறை", smallChanges: "சிறிய மாற்றங்களும் முக்கியம்",
            sidebarNote: "சரியான நேரத்தில் குப்பை சேகரிப்பதும் கரிமக் கழிவுகளை முறையாக கையாள்வதும் தூய்மையான பகுதிகளுக்கு உதவும்.",
            controlCenter: "சுற்றுச்சூழல் கட்டுப்பாட்டு மையம்",
            dashboardTitle: "ஸ்மார்ட் கழிவு மேலாண்மை",
            dashboardSubtitle: "கழிவு நிலைகள், தெரு ஆபத்து மதிப்பீடுகள் மற்றும் சாத்தியமான நடவடிக்கைகளைப் பாருங்கள்.",
            demoMode: "மாதிரி தரவு", heroTag: "காலநிலை நடவடிக்கை • ஸ்மார்ட் நகரங்கள்",
            heroTitle: "சிறந்த கழிவு முடிவுகள் தூய்மையான நகரத்தை உருவாக்கும்.",
            heroDescription: "கழிவு அளவு, கரிமக் கழிவு மற்றும் சேகரிப்பு தாமதத்தை வைத்து சேகரிப்பு முன்னுரிமைகளை EcoGuard AI ஆராய உதவுகிறது. ஆபத்து மதிப்பெண் எப்படி மாறும் என்பதை சோதிக்கவும்.",
            trySimulator: "சோதனையைத் தொடங்கவும்", citySnapshot: "நகர நிலவரம்",
            snapshotSubtitle: "டாஷ்போர்டில் உள்ள மாதிரி தெருக்களின் சுருக்கம்.",
            prototype: "முன்மாதிரி", totalWaste: "மொத்தக் கழிவு அலகுகள்",
            acrossStreets: "கண்காணிக்கப்படும் தெருக்களில்", organicWaste: "கரிமக் கழிவு அலகுகள்",
            needsAttention: "முறையான கையாளுதல் தேவை", highRiskStreets: "அதிக ஆபத்துள்ள தெருக்கள்",
            prioritiseCollection: "சேகரிப்புக்கு முன்னுரிமை அளிக்கவும்", monitoredStreets: "கண்காணிக்கப்படும் தெருக்கள்",
            sampleRecords: "மாதிரி பதிவுகள்", wasteAnalytics: "கழிவு அளவு பகுப்பாய்வு",
            chartSubtitle: "ஒவ்வொரு தெருவிலும் மொத்த மற்றும் கரிமக் கழிவுகளை ஒப்பிடவும்.",
            sampleData: "மாதிரி தரவு", riskMonitorTitle: "ஆபத்து முன்னுரிமை கண்காணிப்பு",
            riskMonitorSubtitle: "மாதிரி மதிப்பீட்டு விதிகளின் அடிப்படையில் தெருக்கள் வரிசைப்படுத்தப்பட்டுள்ளன.",
            high: "அதிக ஆபத்து", medium: "நடுத்தரம்", low: "குறைவு",
            simulatorHeading: "என்ன ஆகும் சோதனை",
            simulatorSubtitle: "தெருவின் நிலைகளை மாற்றி ஆபத்து மதிப்பெண் எவ்வாறு மாறுகிறது என்பதைப் பாருங்கள்.",
            simulateTitle: "சிறந்த சேகரிப்பு முடிவை ஆராயுங்கள்",
            simulateDescription: "கீழே உள்ள மதிப்புகளை மாற்றவும். உங்கள் சோதனை அசல் டாஷ்போர்டு பதிவுகளை மாற்றாது.",
            selectStreet: "தெருவைத் தேர்ந்தெடுக்கவும்", wasteQuantity: "மொத்தக் கழிவு அளவு",
            illustrativeUnits: "மாதிரி அலகுகள்", organicQuantity: "கரிமக் கழிவு அளவு",
            organicMustFit: "மொத்தக் கழிவை விட அதிகமாக இருக்கக்கூடாது",
            collectionDelay: "சேகரிப்பு தாமதம்", noDelay: "தாமதம் இல்லை",
            resetScenario: "தெருவின் அசல் மதிப்புகளுக்கு மீட்டமை",
            estimatedRiskScore: "மதிப்பிடப்பட்ட ஆபத்து மதிப்பெண்",
            calculating: "கணக்கிடப்படுகிறது...", recommendedActions: "பரிந்துரைக்கப்படும் நடவடிக்கைகள்",
            simNote: "இது எளிய விதிகளின் அடிப்படையிலான மாதிரி மதிப்பெண். இது மீத்தேன் அளவையோ உண்மையான உமிழ்வையோ அளவிடாது.",
            streetMonitoring: "தெரு கண்காணிப்பு",
            streetSubtitle: "மாதிரி தெருப் பதிவுகளைத் தேடி ஒப்பிடவும்.",
            searchPlaceholder: "தெருக்களைத் தேடுங்கள்...", exportCsv: "CSV ஏற்றுமதி",
            streetName: "தெரு", wasteCol: "கழிவு", organicCol: "கரிமக் கழிவு",
            delayCol: "தாமதம் (நாட்கள்)", scoreCol: "ஆபத்து மதிப்பெண்", levelCol: "ஆபத்து நிலை",
            environmentTitle: "சுற்றுச்சூழல் முன்னுரிமைகள்",
            environmentSubtitle: "பொறுப்பான கழிவு மேலாண்மைக்கு உதவும் நடைமுறை நடவடிக்கைகள்.",
            organicTitle: "கரிமக் கழிவு மேலாண்மை",
            organicText: "மக்கும் கழிவுகளைப் பிரித்து, பாதுகாப்பான உரமாக்கல் முறைகளைப் பரிசீலிக்கவும்.",
            collectionTitle: "சரியான நேர சேகரிப்பு",
            collectionText: "கழிவு சேரும் அல்லது அடிக்கடி தாமதம் ஏற்படும் தெருக்களுக்கு முன்னுரிமை அளிக்கவும்.",
            climateTitle: "காலநிலை விழிப்புணர்வு",
            climateText: "ஆக்சிஜன் குறைவான சூழலில் கரிமக் கழிவுகள் மீத்தேனை உருவாக்கலாம். முறையான கையாளுதல் தவிர்க்கக்கூடிய உமிழ்வைக் குறைக்க உதவும்.",
            workflowTitle: "EcoGuard AI செயல்முறை",
            workflowSubtitle: "பின்னர் சரிபார்க்கப்பட்ட நகராட்சி தரவுடன் இணைக்கக்கூடிய எளிய முன்மாதிரி.",
            stepOneTitle: "தரவைப் பெறுதல்",
            stepOneText: "கழிவு அளவு, கரிமக் கழிவு மற்றும் சேகரிப்பு தாமதத்தின் மாதிரி மதிப்புகளைப் பயன்படுத்தவும்.",
            stepTwoTitle: "மதிப்பெண் கணக்கீடு",
            stepTwoText: "தெளிவான விதிகளைப் பயன்படுத்தி மாதிரி ஆபத்து மதிப்பெண்ணைக் கணக்கிடவும்.",
            stepThreeTitle: "சூழல்களை ஒப்பிடுதல்",
            stepThreeText: "மதிப்புகளை மாற்றி புதிய மதிப்பெண்ணை அசல் பதிவுடன் ஒப்பிடவும்.",
            stepFourTitle: "நடவடிக்கை திட்டம்",
            stepFourText: "சேகரிப்பு முன்னுரிமைகளை ஆய்ந்து உண்மையான நிலவரத்துடன் சரிபார்க்கவும்.",
            importantNote: "முக்கிய குறிப்பு:",
            disclaimer: "இந்த டாஷ்போர்டு கற்பனை மாதிரி தரவையும் விதி அடிப்படையிலான மதிப்பீட்டையும் பயன்படுத்துகிறது. இது உண்மையான மீத்தேன் அளவோ சரிபார்க்கப்பட்ட கணிப்போ அல்ல. உண்மையான பயன்பாட்டிற்கு நம்பகமான தரவு மற்றும் சுற்றுச்சூழல் சரிபார்ப்பு தேவை.",
            smartWaste: "ஸ்மார்ட் கழிவு மேலாண்மை முன்மாதிரி",
            builtFor: "தூய்மையான, தகவலறிந்த நகரங்களுக்காக உருவாக்கப்பட்டது.",
            days: "நாட்கள்", originalScore: "அசல் மதிப்பெண்",
            scenarioScore: "சோதனை மதிப்பெண்", noChange: "அசல் மதிப்பெண்ணில் மாற்றமில்லை.",
            increased: "ஆபத்து மதிப்பெண் அதிகரித்தது:", decreased: "ஆபத்து மதிப்பெண் குறைந்தது:",
            points: "புள்ளிகள்", riskHigh: "அதிகம்", riskMedium: "நடுத்தரம்", riskLow: "குறைவு",
            noResults: "பொருந்தும் தெருக்கள் இல்லை.", csvDownloaded: "CSV கோப்பு ஏற்றுமதி செய்யப்பட்டது.",
            simulationError: "சோதனையை கணக்கிட முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
            loading: "கணக்கிடப்படுகிறது...", scoreLower: "அசல் பதிவை விட மதிப்பெண் குறைவு.",
            scoreHigher: "அசல் பதிவை விட மதிப்பெண் அதிகம்.",
            sameScore: "அசல் பதிவுக்கு இணையான மதிப்பெண்.",
            originalNotFound: "ஒப்பிடுவதற்கான அசல் தெருப் பதிவு இல்லை.",
            wasteLabel: "கழிவு", organicLabel: "கரிமம்", delayLabel: "தாமதம்",
            complaintsNav: "குடிமக்கள் புகார்கள்", trackingNav: "புகாரைக் கண்காணிக்கவும்",
            complaintsHeading: "குடிமக்கள் புகார்கள்",
            complaintsSubtitle: "கழிவு தொடர்பான பிரச்சினைகளைப் பதிவு செய்து சமீபத்திய புகார்களைப் பாருங்கள்.",
            municipalityNav: "நகராட்சி மேலாண்மை",
            municipalityTitle: "நகராட்சி மேலாண்மை",
            municipalityDescription: "நகரம் முழுவதும் உள்ள கழிவு சேகரிப்பு இடங்களைச் சேர்த்து, மதிப்பாய்வு செய்து, பராமரிக்கவும்.",
            locationDetailTitle: "இருப்பிட விவரம்",
            locationDetailDescription: "தற்போதைய ஆபத்து, புகார்கள் மற்றும் செயல்பாட்டுக் குறிப்புகளை மதிப்பாய்வு செய்யவும்.",
            locationProfileSubtitle: "இந்த சேகரிப்பு மண்டலத்தின் செயல்பாட்டு விவரமும் ஆபத்து தகவல்களும்.",
            backToLocations: "இருப்பிடங்களுக்குத் திரும்பு",
            riskScore: "ஆபத்து மதிப்பெண்",
            riskLevel: "{level} ஆபத்து நிலை",
            riskLevelSuffix: "ஆபத்து நிலை",
            wasteUnit: "கிலோ/நாள்",
            organicShare: "கரிமக் கழிவு பங்கு",
            organicWastePercentage: "கரிமக் கழிவு சதவீதம்",
            collectionInterval: "சேகரிப்பு இடைவெளி",
            locationInformation: "இருப்பிடத் தகவல்",
            typeLabel: "வகை",
            coordinates: "ஆயத்தொலைவுகள்",
            lastCollection: "கடைசி சேகரிப்பு",
            fillLevel: "நிரம்பிய அளவு",
            segregationEfficiency: "கழிவு பிரிப்பு திறன்",
            statusLabel: "நிலை",
            dataSource: "தரவு மூலம்",
            unavailable: "கிடைக்கவில்லை",
            notProvided: "வழங்கப்படவில்லை",
            continueMonitoring: "தொடர்ந்து கண்காணிக்கவும்",
            reviewScheduling: "சேகரிப்பு அட்டவணையை மதிப்பாய்வு செய்யவும்",
            prioritiseCollectionAction: "சேகரிப்புக்கு முன்னுரிமை அளிக்கவும்",
            riskMethodNote: "ஆபத்து கணக்கீடுகள் பயன்பாட்டின் பிற பகுதிகளில் உள்ள அதே வெளிப்படையான விதிமுறை தர்க்கத்தைப் பயன்படுத்துகின்றன. இவை அளவுத்திருத்தம் செய்யப்பட்ட மீத்தேன் அளவீடுகள் அல்ல.",
            relatedComplaints: "தொடர்புடைய புகார்கள்",
            relatedComplaintsDescription: "இந்த இருப்பிடத்துடன் தொடர்புடைய வரலாற்றுப் புகார் பதிவுகள்.",
            noComplaintHistory: "இந்த இருப்பிடத்திற்கு புகார் வரலாறு இல்லை.",
            locationNameValidation: "இருப்பிடப் பெயர் 2 முதல் 120 எழுத்துகளுக்குள் இருக்க வேண்டும்.",
            locationTypeValidation: "சரியான இருப்பிட வகையைத் தேர்ந்தெடுக்கவும்.",
            wardRequiredValidation: "வார்டு அல்லது மண்டலம் தேவை.",
            locationNumbersValidation: "கழிவு, கரிமப் பொருள் மற்றும் சேகரிப்பு இடைவெளி செல்லுபடியாகும் எண்களாக இருக்க வேண்டும்.",
            wasteNegativeValidation: "மதிப்பிடப்பட்ட மொத்தக் கழிவு எதிர்மறையாக இருக்கக்கூடாது.",
            organicRangeValidation: "கரிமக் கழிவு சதவீதம் 0 முதல் 100 வரை இருக்க வேண்டும்.",
            collectionFrequencyValidation: "சேகரிப்பு இடைவெளி நாட்களில் நேர்மறை எண்ணாக இருக்க வேண்டும்.",
            coordinatesNumericValidation: "அட்சரேகையும் தீர்க்கரேகையும் எண்களாக இருக்க வேண்டும்.",
            coordinatesPairValidation: "அட்சரேகையும் தீர்க்கரேகையும் இரண்டும் வழங்கப்பட வேண்டும்.",
            coordinatesRangeValidation: "ஆயத்தொலைவுகள் பூமிக்கான செல்லுபடியாகும் வரம்பிற்கு வெளியே உள்ளன.",
            fillNumericValidation: "நிரம்பிய அளவு சதவீதம் எண்ணாக இருக்க வேண்டும்.",
            fillRangeValidation: "நிரம்பிய அளவு சதவீதம் 0 முதல் 100 வரை இருக்க வேண்டும்.",
            segregationNumericValidation: "கழிவு பிரிப்பு திறன் எண்ணாக இருக்க வேண்டும்.",
            segregationRangeValidation: "கழிவு பிரிப்பு திறன் 0 முதல் 100 வரை இருக்க வேண்டும்.",
            collectionDateValidation: "கடைசி சேகரிப்பு தேதி செல்லுபடியாகும் ISO தேதி அல்லது நேரமாக இருக்க வேண்டும்.",
            notesLengthValidation: "குறிப்புகள் 500 எழுத்துகளுக்கு மிகாமல் இருக்க வேண்டும்.",
            duplicateLocation: "இதே போன்ற பெயரில் இருப்பிடம் ஏற்கனவே உள்ளது.",
            locationIdRequired: "பதிவைத் திருத்த சரியான இருப்பிட அடையாள எண் தேவை.",
            locationNotFound: "அந்த இருப்பிடத்தைக் கண்டறிய முடியவில்லை.",
            locationAdded: "இருப்பிடம் வெற்றிகரமாகச் சேர்க்கப்பட்டது.",
            locationUpdated: "இருப்பிடம் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது.",
            locationDeactivated: "{name} அதன் வரலாற்றுப் பதிவுகளை நீக்காமல் முடக்கப்பட்டது.",
            locationDeactivateFailed: "இருப்பிடத்தை முடக்க முடியவில்லை.",
            locationDetailNotFound: "இருப்பிடத்தைக் கண்டறிய முடியவில்லை.",
            municipalityPageTitle: "நகராட்சி இருப்பிட மேலாண்மை",
            municipalityPageSubtitle: "செயல்பாட்டில் உள்ள சேகரிப்பு மண்டலங்களை மதிப்பாய்வு செய்து புதிய நகராட்சி இடங்களைப் சேர்க்கவும்.",
            liveDatabase: "நேரடி தரவுத்தளம்",
            totalLocations: "மொத்த இருப்பிடங்கள்",
            totalLocationsFoot: "பதிவு செய்யப்பட்ட செயல்பாட்டு தளங்கள்",
            activeLocations: "செயலில்",
            activeLocationsFoot: "திசைமாற்றம் மற்றும் ஆபத்து பகுப்பாய்வுக்கு கிடைக்கிறது",
            highRiskLocations: "அதிக ஆபத்து",
            highRiskFoot: "முன்னுரிமை சேகரிப்பு வேட்பாளர்கள்",
            needsAttentionLocations: "கவனிப்பு தேவை",
            needsAttentionFoot: "சேகரிப்பு அதிர்வெண், நிரப்புதல் அளவுகளை ஆய்வு செய்யவும்",
            addNewLocationTitle: "புதிய இருப்பிடத்தைச் சேர்க்கவும்",
            addNewLocationSubtitle: "SQLite இல் இருப்பிடத் தரவை சேமித்து, அது உடனடியாக முழு தளத்திலும் கிடைக்கும்.",
            locationName: "இடத்தின் பெயர்",
            locationNamePlaceholder: "அண்ணா நகர் சந்திப்பு",
            locationTypeLabel: "இட வகை",
            locationTypeJunction: "சந்திப்பு",
            locationTypeStreet: "தெரு",
            locationTypeWard: "வார்டு",
            locationTypeMarket: "சந்தை",
            locationTypeResidential: "குடியிருப்புப் பகுதி",
            locationTypeOther: "மற்றவை",
            wardOrZone: "மாவட்டம் அல்லது மண்டல அடையாளம்",
            wardOrZonePlaceholder: "மாவட்டம் 12",
            estimatedWasteField: "மொத்த கழிவு (கிலோ/நாள்)",
            organicWasteField: "கரிம கழிவு (%)",
            collectionFrequencyField: "சேகரிப்பு அதிர்வெண் (நாட்கள்)",
            latitudeLabel: "அட்சரேகை",
            longitudeLabel: "தீர்க்கரேகை",
            lastCollectionField: "கடைசியாக சேகரிக்கப்பட்ட தேதி மற்றும் நேரம்",
            fillLevelField: "நிரப்பும் நிலை (%)",
            overflowHistoryField: "கழிவு நிரம்பி வழிந்த நிகழ்வுகள்",
            overflowHistoryPlaceholder: "எ.கா. 2 மிதமான அதிகரிப்புகள்",
            segregationEfficiencyField: "பிரித்தெடுக்கும் திறன் (%)",
            notesLabel: "குறிப்புகள்",
            notesPlaceholder: "விருப்பமான செயல்பாட்டு அவதானிப்புகள்",
            addLocationButton: "இருப்பிடத்தைச் சேர்க்கவும்",
            registeredLocationsTitle: "பதிவு செய்யப்பட்ட இருப்பிடங்கள்",
            registeredLocationsSubtitle: "இருப்பிடங்களை தேடி, மதிப்பாய்வு செய்து, வரலாற்றுத் பதிவுகளை நீக்காமல் முடக்கவும்.",
            searchLocationPlaceholder: "இருப்பிட பெயரால் தேடுக",
            searchLocations: "இருப்பிடங்களைத் தேடுங்கள்",
            filterStatus: "நிலையின் மூலம் வடிகட்டவும்",
            allStatuses: "அனைத்து நிலைகளும்",
            statusActive: "செயலில்",
            statusInactive: "முடக்கப்பட்டது",
            applyFilters: "வடிப்பான்களைப் பயன்படுத்தவும்",
            detailAction: "விவரம்",
            deactivateAction: "முடக்கு",
            deactivateConfirm: "இந்த இருப்பிடத்தை முடக்கவா? வரலாற்றுப் பதிவுகள் இருக்கும்.",
            noLocationsMatch: "தற்போதைய தேடல் அல்லது வடிகட்டுதல் எதற்கும் பொருந்தும் இருப்பிடங்கள் இல்லை.",
            adminLink: "நிர்வாகி உள்நுழைவு", totalComplaints: "மொத்த புகார்கள்",
            pendingComplaints: "நிலுவைப் புகார்கள்", resolvedComplaints: "தீர்க்கப்பட்ட புகார்கள்",
            communityReports: "பெறப்பட்ட சமூகப் புகார்கள்", awaitingReview: "பரிசீலனை அல்லது நடவடிக்கைக்காக காத்திருக்கிறது",
            completedReports: "தீர்க்கப்பட்டதாகக் குறிக்கப்பட்டது", submitReport: "கழிவு புகாரைப் பதிவு செய்யவும்",
            formHelp: "பிரச்சினையை அடையாளம் கண்டு பரிசீலிக்க உள்ளூர் குழுவுக்கு போதுமான விவரங்களை வழங்கவும்.",
            citizenName: "உங்கள் பெயர்", complaintStreet: "தெரு அல்லது பகுதி",
            categoryLabel: "கழிவு பிரச்சினை வகை", chooseCategory: "வகையைத் தேர்ந்தெடுக்கவும்",
            catOverflow: "நிரம்பி வழியும் கழிவு", catDumping: "சட்டவிரோதமாகக் கொட்டுதல்",
            catMissed: "தவறிய சேகரிப்பு", catMixed: "கலந்த அல்லது பிரிக்காத கழிவு",
            catHazardous: "அபாயகரமான கழிவு", catOther: "மற்றவை",
            descriptionLabel: "விளக்கம்", photoOptional: "புகைப்படம் (விருப்பம்)",
            photoHelp: "JPEG, PNG அல்லது WebP; அதிகபட்சம் 5 MB.",
            submitComplaint: "புகாரைச் சமர்ப்பிக்கவும்", recentReports: "சமீபத்திய புகார்கள்",
            recurringIntro: "இரண்டு அல்லது அதற்கு மேற்பட்ட புகார்கள் உள்ள தெருக்கள் மீண்டும் புகார் உள்ளதாகக் காட்டப்படும்.",
            dateLabel: "தேதி", statusLabel: "நிலை",
            noReports: "இதுவரை புகார்கள் சமர்ப்பிக்கப்படவில்லை.",
            recurringComplaints: "மீண்டும் புகார் உள்ள தெருக்கள்",
            reportsCount: "புகார்கள்", noRecurring: "பல புகார்கள் உள்ள தெருக்கள் இல்லை.",
            trackHeading: "புகாரைக் கண்காணிக்கவும்",
            trackSubtitle: "புகாரைச் சமர்ப்பித்தபோது கிடைத்த புகார் அடையாள எண்ணை உள்ளிடவும்.",
            complaintId: "புகார் அடையாள எண்", trackButton: "நிலையைப் பார்க்கவும்",
            submittedMessage: "உங்கள் புகார் சமர்ப்பிக்கப்பட்டது. இந்த எண்ணைச் சேமிக்கவும்:",
            invalidComplaint: "இந்த புகார் அடையாள எண் கிடைக்கவில்லை. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
            trackingDetails: "புகார் விவரங்கள்", pendingStatus: "நிலுவையில்",
            inProgressStatus: "செயல்பாட்டில்", resolvedStatus: "தீர்க்கப்பட்டது",
            invalidPhoto: "JPEG, PNG அல்லது WebP புகைப்படத்தைத் தேர்ந்தெடுக்கவும்.",
            photoTooLarge: "புகைப்படம் 5 MB அல்லது அதற்குக் குறைவாக இருக்க வேண்டும்.",
            requiredFields: "தேவையான விவரங்களை உள்ளிடவும்.",
            adminNav: "நிர்வாக மேலாண்மை", adminLoginTitle: "நிர்வாகி உள்நுழைவு",
            adminLoginDescription: "இந்த நிறுவலுக்காக அமைக்கப்பட்ட நிர்வாகி விவரங்களுடன் உள்நுழையவும்.",
            adminPageTitle: "புகார் நிர்வாகம்",
            adminPageDescription: "குடிமக்கள் புகார்களைப் பரிசீலித்து அவற்றின் நிலையைப் புதுப்பிக்கவும்.",
            signOut: "வெளியேறு", updateStatus: "நிலையைப் புதுப்பிக்கவும்", saveStatus: "சேமி",
            analyticsTitle: "தரவு பகுப்பாய்வு மற்றும் விளக்கக்கூடிய மதிப்பீடுகள்",
            analyticsDescription: "மாதிரி கழிவு உள்ளீடுகளையும் விதி அடிப்படையிலான ஆபத்து மதிப்பீடுகளையும் ஒப்பிடவும்.",
            riskPageTitle: "தெரு அளவிலான ஆபத்து கண்காணிப்பு",
            riskPageDescription: "மாதிரி மதிப்பெண்களையும் சேகரிப்பு நடவடிக்கை பரிந்துரைகளையும் பாருங்கள்.",
            collectionPriorities: "சேகரிப்பு முன்னுரிமைகள்", viewAll: "அனைத்தையும் காண்க",
            complaintSnapshot: "புகார் நிலவரம்",
            complaintCountsHint: "குடிமக்கள் புகார்களின் தற்போதைய நிலை எண்ணிக்கை.",
            manageReports: "புகார்களை நிர்வகிக்கவும்", recentReportsHint: "குடிமக்கள் சமர்ப்பித்த சமீபத்திய புகார்கள்.",
            trackNavShort: "புகாரைக் கண்காணிக்கவும்",
            riskDistribution: "தெரு ஆபத்து பகிர்வு",
            riskDistributionDescription: "வெளிப்படையான மதிப்பெண் நிலைகளின் எண்ணிக்கை.",
            riskDrivers: "மதிப்பீடு எவ்வாறு உருவாகிறது",
            riskDriversDescription: "ஒவ்வொரு நிலையும் ஆய்வு செய்யக்கூடிய மதிப்பெண்ணைச் சேர்க்கிறது.",
            wasteRule: "70+ இல் 25 புள்ளிகள்; 100+ இல் 40 புள்ளிகள்",
            organicRule: "35+ இல் 15 புள்ளிகள்; 60+ இல் 30 புள்ளிகள்",
            delayRule: "1 நாளில் 15 புள்ளிகள்; 2+ நாட்களில் 30 புள்ளிகள்",
            streetEstimates: "தெரு மதிப்பீடுகள்",
            estimateExplanation: "மதிப்பெண்கள் 100 ஆக வரையறுக்கப்பட்டு குறைந்த, நடுத்தர, அதிக முன்னுரிமை நிலைகளாகப் பிரிக்கப்படும்.",
            ruleEstimate: "விதி அடிப்படையிலான மதிப்பீடு",
            estimateDisclaimerTitle: "மதிப்பீடு; முன்னறிவிப்பு அல்ல:",
            estimateDisclaimer: "இவை கற்பனை மாதிரி உள்ளீடுகளிலிருந்து உருவான விதி அடிப்படையிலான மதிப்பீடுகள்; உண்மையான போக்கு, மீத்தேன் அளவீடு அல்லது பயிற்சியளிக்கப்பட்ட AI கணிப்பு அல்ல.",
            recommendationsTitle: "பரிந்துரைக்கப்படும் நடவடிக்கைகள்",
            recommendationsDescription: "ஒவ்வொரு தெருவின் பதிவு செய்யப்பட்ட நிலைகளின் அடிப்படையில் பரிந்துரைகள் உருவாக்கப்படுகின்றன.",
            recommendHigh: "சேகரிப்புக்கு முன்னுரிமை அளித்து உடனடியாக ஆய்வு செய்யவும்.",
            recommendMedium: "விரைவில் சேகரிப்பைத் திட்டமிட்டு கண்காணிக்கவும்.",
            recommendLow: "வழக்கமான சேகரிப்பு மற்றும் கண்காணிப்பைத் தொடரவும்.",
            interactive: "ஊடாடும்",
            mapTitle: "கழிவு அதிகமுள்ள பகுதிகளின் வரைபடம்",
            mapOverviewSubtitle: "அதிக முன்னுரிமைப் பகுதிகளும் அவற்றின் தற்போதைய நடவடிக்கை நிலையும்.",
            mapRiskSubtitle: "உடனடி சேகரிப்பு தேவைப்படும் பகுதிகளைக் கண்டறியவும்.",
            mapFilterAll: "அனைத்தும்",
            mapLoading: "கழிவு பகுதிகளின் வரைபடம் ஏற்றப்படுகிறது...",
            mapEmpty: "இந்த வடிகட்டிக்கு பொருந்தும் ஆபத்து பகுதிகள் இல்லை.",
            mapTilesUnavailable: "வரைபடப் படங்களை ஏற்ற முடியவில்லை. தெரு முன்னுரிமைப் பட்டியல் கீழே உள்ளது.",
            mapLibraryUnavailable: "ஊடாடும் வரைபடத்தை ஏற்ற முடியவில்லை. தெரு முன்னுரிமைப் பட்டியல் கீழே உள்ளது.",
            mapLegendHigh: "அதிக ஆபத்து", mapLegendMedium: "நடுத்தர ஆபத்து", mapLegendLow: "குறைந்த ஆபத்து",
            notificationsTitle: "அறிவிப்புகள்", openNotifications: "அறிவிப்புகளைத் திறக்கவும்",
            markAllRead: "அனைத்தையும் படித்ததாகக் குறிக்கவும்", noNotifications: "அறிவிப்புகள் எதுவும் இல்லை.",
            severityInfo: "தகவல்", severityWarning: "எச்சரிக்கை", severityUrgent: "அவசரம்",
            username: "பயனர் பெயர்", password: "கடவுச்சொல்", signIn: "உள்நுழைக",
            statusForComplaint: "புகார் நிலை",
            selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
            highRiskNotificationTitle: "அதிக ஆபத்துள்ள பகுதி: {zone}",
            highRiskNotificationMessage: "{zone} பகுதியில் ஆபத்து அதிகம். பரிந்துரைக்கப்படும் நடவடிக்கை: {action}",
            overdueNotificationTitle: "{zone} பகுதியில் சேகரிப்பு தாமதம்",
            overdueNotificationMessage: "{zone} பகுதியில் கழிவு சேகரிப்பு தாமதமாகியுள்ளது. அட்டவணையை ஆய்ந்து பணியாளர்களை அனுப்பவும்.",
            recurringNotificationTitle: "{zone} அருகே மீண்டும் புகார்கள்",
            recurringNotificationMessage: "{zone} அருகே மீண்டும் புகார்கள் பதிவாகியுள்ளன. தொடர்ந்து சேகரிப்பைத் திட்டமிட வேண்டியிருக்கலாம்.",
            complaintSubmittedTitle: "புதிய குடிமக்கள் புகார் பெறப்பட்டது",
            complaintSubmittedMessage: "{zone} பகுதிக்கான புதிய புகார் பரிசீலனைக்காக காத்திருக்கிறது.",
            complaintStatusTitle: "புகாரின் நிலை புதுப்பிக்கப்பட்டது",
            complaintStatusMessage: "{zone} பகுதிக்கான புகார் இப்போது {status} எனக் குறிக்கப்பட்டுள்ளது.",
            simulationNotificationTitle: "{zone} பகுதியின் ஆபத்து சோதனை மாறியது",
            simulationNotificationMessage: "{zone} பகுதியின் சோதனை ஆபத்து குறிப்பிடத்தக்க அளவில் மாறியது. முன்னுரிமையை ஆய்வு செய்யவும்.",
            notificationUpdateError: "அறிவிப்புகளைப் புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
            notificationInvalidId: "இந்த அறிவிப்புக்கு சரியான அடையாள எண் இல்லை.",
            oversizedRequest: "பதிவேற்றிய கோப்பு மிகவும் பெரியது. புகைப்படங்கள் 5 MB அல்லது அதற்குக் குறைவாக இருக்க வேண்டும்.",
            complaintSaveFailed: "புகாரைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
            adminLoginFailed: "நிர்வாகி பயனர் பெயர் அல்லது கடவுச்சொல் தவறானது.",
            complaintUpdated: "புகார் நிலை புதுப்பிக்கப்பட்டது.",
            nameValidation: "பெயர் 2 முதல் 100 எழுத்துகளுக்குள் இருக்க வேண்டும்.",
            streetValidation: "தெரு பெயர் 2 முதல் 120 எழுத்துகளுக்குள் இருக்க வேண்டும்.",
            categoryValidation: "சரியான கழிவு பிரச்சினை வகையைத் தேர்ந்தெடுக்கவும்.",
            descriptionValidation: "விளக்கம் 10 முதல் 2000 எழுத்துகளுக்குள் இருக்க வேண்டும்.",
            photoTypeValidation: "JPEG, PNG அல்லது WebP புகைப்படத்தைத் தேர்ந்தெடுக்கவும்.",
            photoSizeValidation: "புகைப்படம் 5 MB அல்லது அதற்குக் குறைவாக இருக்க வேண்டும்.",
            photoMismatch: "பதிவேற்றிய கோப்பு ஆதரிக்கப்படும் புகைப்பட வகையுடன் பொருந்தவில்லை.",
            photoStorageError: "புகைப்படத்தைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
        },
        hi: {
            workspace: "कार्यस्थान", overview: "अवलोकन", analytics: "विश्लेषण",
            riskMonitoring: "जोखिम निगरानी", simulator: "क्या-हो-अगर सिम्युलेटर",
            streets: "सड़कें", environment: "पर्यावरणीय प्रभाव",
            howItWorks: "यह कैसे काम करता है", smallChanges: "छोटे बदलाव भी मायने रखते हैं",
            sidebarNote: "समय पर कचरा संग्रह और जैविक कचरे का उचित प्रबंधन स्वच्छ मोहल्लों में मदद कर सकता है।",
            controlCenter: "पर्यावरण नियंत्रण केंद्र",
            dashboardTitle: "स्मार्ट कचरा डैशबोर्ड",
            dashboardSubtitle: "कचरे की स्थिति देखें, सड़क-स्तर के जोखिम की तुलना करें और संभावित उपाय खोजें।",
            demoMode: "डेमो डेटा मोड", heroTag: "जलवायु कार्रवाई • स्मार्ट शहर",
            heroTitle: "बेहतर कचरा निर्णय से स्वच्छ शहर की शुरुआत होती है।",
            heroDescription: "EcoGuard AI कचरे की मात्रा, जैविक कचरे और संग्रह में देरी के उदाहरणों के आधार पर प्राथमिकताएँ तय करने में मदद करता है। जोखिम स्कोर में बदलाव देखने के लिए सिम्युलेटर का उपयोग करें।",
            trySimulator: "सिम्युलेटर आज़माएँ", citySnapshot: "शहर की स्थिति",
            snapshotSubtitle: "डैशबोर्ड में मौजूद उदाहरण सड़कों का सारांश।",
            prototype: "प्रोटोटाइप", totalWaste: "कुल कचरा इकाइयाँ",
            acrossStreets: "निगरानी वाली सड़कों पर", organicWaste: "जैविक कचरा इकाइयाँ",
            needsAttention: "उचित प्रबंधन आवश्यक", highRiskStreets: "उच्च जोखिम वाली सड़कें",
            prioritiseCollection: "संग्रह को प्राथमिकता दें", monitoredStreets: "निगरानी वाली सड़कें",
            sampleRecords: "उदाहरण रिकॉर्ड", wasteAnalytics: "कचरा मात्रा विश्लेषण",
            chartSubtitle: "प्रत्येक सड़क पर कुल और जैविक कचरे की तुलना करें।",
            sampleData: "उदाहरण डेटा", riskMonitorTitle: "जोखिम प्राथमिकता निगरानी",
            riskMonitorSubtitle: "प्रोटोटाइप नियमों के अनुसार सड़कें क्रमबद्ध हैं।",
            high: "उच्च जोखिम", medium: "मध्यम", low: "कम",
            simulatorHeading: "क्या-हो-अगर सिम्युलेटर",
            simulatorSubtitle: "सड़क की स्थितियाँ बदलें और देखें कि नियम-आधारित जोखिम स्कोर कैसे बदलता है।",
            simulateTitle: "बेहतर संग्रह निर्णय का परीक्षण करें",
            simulateDescription: "नीचे के मान बदलें। आपका परीक्षण मूल डैशबोर्ड रिकॉर्ड को नहीं बदलेगा।",
            selectStreet: "सड़क चुनें", wasteQuantity: "कुल कचरे की मात्रा",
            illustrativeUnits: "उदाहरण इकाइयाँ", organicQuantity: "जैविक कचरे की मात्रा",
            organicMustFit: "कुल कचरे से अधिक नहीं हो सकता",
            collectionDelay: "संग्रह में देरी", noDelay: "देरी नहीं",
            resetScenario: "सड़क के मूल मान रीसेट करें",
            estimatedRiskScore: "अनुमानित जोखिम स्कोर",
            calculating: "गणना हो रही है...", recommendedActions: "सुझाए गए कदम",
            simNote: "यह सरल नियमों पर आधारित उदाहरण स्कोर है। यह मीथेन या वास्तविक उत्सर्जन को नहीं मापता।",
            streetMonitoring: "सड़क निगरानी",
            streetSubtitle: "उदाहरण सड़क रिकॉर्ड खोजें और तुलना करें।",
            searchPlaceholder: "सड़क खोजें...", exportCsv: "CSV निर्यात",
            streetName: "सड़क", wasteCol: "कचरा", organicCol: "जैविक",
            delayCol: "देरी (दिन)", scoreCol: "जोखिम स्कोर", levelCol: "जोखिम स्तर",
            environmentTitle: "पर्यावरणीय प्राथमिकताएँ",
            environmentSubtitle: "जिम्मेदार कचरा प्रबंधन में मदद करने वाले व्यावहारिक कदम।",
            organicTitle: "जैविक कचरे का प्रबंधन",
            organicText: "जैविक कचरे को अलग करें और सुरक्षित खाद बनाने के उपयुक्त तरीकों पर विचार करें।",
            collectionTitle: "समय पर संग्रह",
            collectionText: "जहाँ कचरा जमा हो रहा है या बार-बार देरी होती है, उन सड़कों को प्राथमिकता दें।",
            climateTitle: "जलवायु जागरूकता",
            climateText: "कम ऑक्सीजन वाली स्थितियों में जैविक कचरे से मीथेन बन सकती है। उचित प्रबंधन अनावश्यक उत्सर्जन घटाने में मदद कर सकता है।",
            workflowTitle: "EcoGuard AI कैसे काम करता है",
            workflowSubtitle: "एक सरल प्रोटोटाइप जिसे आगे सत्यापित नगरपालिका डेटा से जोड़ा जा सकता है।",
            stepOneTitle: "इनपुट लें",
            stepOneText: "कचरे की मात्रा, जैविक कचरे और संग्रह में देरी के उदाहरण उपयोग करें।",
            stepTwoTitle: "स्कोर निकालें",
            stepTwoText: "उदाहरण जोखिम स्कोर के लिए स्पष्ट नियम लागू करें।",
            stepThreeTitle: "तुलना करें",
            stepThreeText: "सिम्युलेटर मान बदलें और नए स्कोर की मूल रिकॉर्ड से तुलना करें।",
            stepFourTitle: "कार्रवाई की योजना",
            stepFourText: "संग्रह प्राथमिकताओं की समीक्षा करें और वास्तविक स्थितियों से पुष्टि करें।",
            importantNote: "महत्वपूर्ण प्रोटोटाइप सूचना:",
            disclaimer: "डैशबोर्ड काल्पनिक उदाहरण डेटा और नियम-आधारित स्कोरिंग का उपयोग करता है। स्कोर वास्तविक मीथेन स्तर या सत्यापित पूर्वानुमान नहीं हैं। वास्तविक उपयोग के लिए विश्वसनीय डेटा और पर्यावरणीय सत्यापन आवश्यक होंगे।",
            smartWaste: "स्मार्ट कचरा प्रबंधन प्रोटोटाइप",
            builtFor: "स्वच्छ और अधिक जागरूक शहरों के लिए।",
            days: "दिन", originalScore: "मूल स्कोर",
            scenarioScore: "परिदृश्य स्कोर", noChange: "मूल स्कोर में कोई बदलाव नहीं।",
            increased: "जोखिम स्कोर बढ़ा:", decreased: "जोखिम स्कोर घटा:",
            points: "अंक", riskHigh: "उच्च", riskMedium: "मध्यम", riskLow: "कम",
            noResults: "कोई मेल खाती सड़क नहीं मिली।", csvDownloaded: "CSV फ़ाइल निर्यात हुई।",
            simulationError: "परिदृश्य की गणना नहीं हो सकी। फिर प्रयास करें।",
            loading: "गणना हो रही है...", scoreLower: "स्कोर मूल रिकॉर्ड से कम है।",
            scoreHigher: "स्कोर मूल रिकॉर्ड से अधिक है।",
            sameScore: "स्कोर मूल रिकॉर्ड के बराबर है।",
            originalNotFound: "तुलना के लिए मूल सड़क रिकॉर्ड उपलब्ध नहीं है।",
            wasteLabel: "कचरा", organicLabel: "जैविक", delayLabel: "देरी",
            complaintsNav: "नागरिक शिकायतें", trackingNav: "शिकायत ट्रैक करें",
            complaintsHeading: "नागरिक शिकायतें",
            complaintsSubtitle: "कचरे की समस्या दर्ज करें और हाल की सामुदायिक शिकायतें देखें।",
            municipalityNav: "नगरपालिका प्रबंधन",
            municipalityTitle: "नगरपालिका प्रबंधन",
            municipalityDescription: "शहर भर के कचरा संग्रहण स्थान जोड़ें, उनकी समीक्षा करें और प्रबंधित करें।",
            locationDetailTitle: "स्थान का विवरण",
            locationDetailDescription: "मौजूदा जोखिम, शिकायतों और परिचालन टिप्पणियों की समीक्षा करें।",
            locationProfileSubtitle: "इस संग्रहण क्षेत्र की परिचालन जानकारी और जोखिम विवरण।",
            backToLocations: "स्थानों पर वापस जाएँ",
            riskScore: "जोखिम स्कोर",
            riskLevel: "{level} जोखिम स्तर",
            riskLevelSuffix: "जोखिम स्तर",
            wasteUnit: "किलो/दिन",
            organicShare: "जैविक कचरे का हिस्सा",
            organicWastePercentage: "जैविक कचरे का प्रतिशत",
            collectionInterval: "संग्रह अंतराल",
            locationInformation: "स्थान की जानकारी",
            typeLabel: "प्रकार",
            coordinates: "निर्देशांक",
            lastCollection: "अंतिम संग्रह",
            fillLevel: "भराव स्तर",
            segregationEfficiency: "कचरा पृथक्करण दक्षता",
            dataSource: "डेटा स्रोत",
            unavailable: "उपलब्ध नहीं",
            notProvided: "प्रदान नहीं किया गया",
            continueMonitoring: "निगरानी जारी रखें",
            reviewScheduling: "संग्रह समय-सारणी की समीक्षा करें",
            prioritiseCollectionAction: "संग्रह को प्राथमिकता दें",
            riskMethodNote: "जोखिम की गणना में ऐप के अन्य भागों जैसा ही पारदर्शी नियम-आधारित तरीका उपयोग होता है। ये कैलिब्रेट किए गए मीथेन माप नहीं हैं।",
            relatedComplaints: "संबंधित शिकायतें",
            relatedComplaintsDescription: "इस स्थान से जुड़े पुराने शिकायत रिकॉर्ड।",
            noComplaintHistory: "इस स्थान के लिए कोई शिकायत इतिहास नहीं मिला।",
            locationNameValidation: "स्थान का नाम 2 से 120 अक्षरों के बीच होना चाहिए।",
            locationTypeValidation: "कृपया स्थान का मान्य प्रकार चुनें।",
            wardRequiredValidation: "वार्ड या जोन आवश्यक है।",
            locationNumbersValidation: "कचरे, जैविक सामग्री और संग्रह अंतराल के मान्य अंक दर्ज करें।",
            wasteNegativeValidation: "अनुमानित कुल कचरा ऋणात्मक नहीं हो सकता।",
            organicRangeValidation: "जैविक कचरे का प्रतिशत 0 से 100 के बीच होना चाहिए।",
            collectionFrequencyValidation: "संग्रह अंतराल दिनों में सकारात्मक संख्या होनी चाहिए।",
            coordinatesNumericValidation: "अक्षांश और देशांतर संख्यात्मक होने चाहिए।",
            coordinatesPairValidation: "अक्षांश और देशांतर दोनों दर्ज करें।",
            coordinatesRangeValidation: "निर्देशांक पृथ्वी की मान्य सीमा से बाहर हैं।",
            fillNumericValidation: "भराव स्तर प्रतिशत संख्यात्मक होना चाहिए।",
            fillRangeValidation: "भराव स्तर प्रतिशत 0 से 100 के बीच होना चाहिए।",
            segregationNumericValidation: "कचरा पृथक्करण दक्षता संख्यात्मक होनी चाहिए।",
            segregationRangeValidation: "कचरा पृथक्करण दक्षता 0 से 100 के बीच होनी चाहिए।",
            collectionDateValidation: "अंतिम संग्रह की तारीख मान्य ISO तारीख या समय होनी चाहिए।",
            notesLengthValidation: "टिप्पणियाँ 500 अक्षरों से अधिक नहीं होनी चाहिए।",
            duplicateLocation: "इसी नाम का मिलता-जुलता स्थान पहले से मौजूद है।",
            locationIdRequired: "रिकॉर्ड संपादित करने के लिए मान्य स्थान ID आवश्यक है।",
            locationNotFound: "वह स्थान नहीं मिला।",
            locationAdded: "स्थान सफलतापूर्वक जोड़ा गया।",
            locationUpdated: "स्थान सफलतापूर्वक अपडेट किया गया।",
            locationDeactivated: "{name} को पुराने रिकॉर्ड हटाए बिना निष्क्रिय किया गया।",
            locationDeactivateFailed: "स्थान निष्क्रिय नहीं किया जा सका।",
            locationDetailNotFound: "स्थान नहीं मिला।",
            municipalityPageTitle: "नगरपालिका स्थान प्रबंधन",
            municipalityPageSubtitle: "सक्रिय संग्रहण क्षेत्रों की समीक्षा करें और साझा संचालन डेटाबेस में नए नगरपालिका स्थान जोड़ें।",
            liveDatabase: "लाइव डेटाबेस",
            totalLocations: "कुल स्थान",
            totalLocationsFoot: "पंजीकृत परिचालन स्थल",
            activeLocations: "सक्रिय",
            activeLocationsFoot: "रूटिंग और जोखिम विश्लेषण के लिए उपलब्ध",
            highRiskLocations: "उच्च जोखिम",
            highRiskFoot: "प्राथमिकता संग्रहण उम्मीदवार",
            needsAttentionLocations: "ध्यान देने की आवश्यकता",
            needsAttentionFoot: "संग्रह दर और भराव स्तर की समीक्षा करें",
            addNewLocationTitle: "नया स्थान जोड़ें",
            addNewLocationSubtitle: "SQLite में स्थान डेटा संग्रहीत करें ताकि यह तुरंत प्लेटफ़ॉर्म पर उपलब्ध हो जाए।",
            locationName: "स्थान का नाम",
            locationNamePlaceholder: "अन्ना नगर जंक्शन",
            locationTypeLabel: "स्थान का प्रकार",
            locationTypeJunction: "चौराहा",
            locationTypeStreet: "सड़क",
            locationTypeWard: "वार्ड",
            locationTypeMarket: "बाज़ार",
            locationTypeResidential: "आवासीय क्षेत्र",
            locationTypeOther: "अन्य",
            wardOrZone: "वार्ड या जोन पहचानकर्ता",
            wardOrZonePlaceholder: "वार्ड 12",
            estimatedWasteField: "अनुमानित कुल कचरा (किलो/दिन)",
            organicWasteField: "जैविक कचरा (%)",
            collectionFrequencyField: "संग्रह आवृत्ति (दिन)",
            latitudeLabel: "अक्षांश",
            longitudeLabel: "देशांतर",
            lastCollectionField: "अंतिम संग्रह तिथि और समय",
            fillLevelField: "भराव स्तर (%)",
            overflowHistoryField: "अतिप्रवाह घटनाएँ",
            overflowHistoryPlaceholder: "उदा. 2 मध्यम अतिप्रवाह",
            segregationEfficiencyField: "वर्गीकरण दक्षता (%)",
            notesLabel: "टिप्पणियाँ",
            notesPlaceholder: "वैकल्पिक परिचालन टिप्पणियाँ",
            addLocationButton: "स्थान जोड़ें",
            registeredLocationsTitle: "पंजीकृत स्थान",
            registeredLocationsSubtitle: "स्थान खोजें, समीक्षा करें और ऐतिहासिक रिकॉर्ड हटाए बिना उन्हें निष्क्रिय करें।",
            searchLocationPlaceholder: "स्थान के नाम से खोजें",
            searchLocations: "स्थान खोजें",
            filterStatus: "स्थिति के आधार पर फ़िल्टर करें",
            allStatuses: "सभी स्थितियाँ",
            statusActive: "सक्रिय",
            statusInactive: "निष्क्रिय",
            applyFilters: "फ़िल्टर लागू करें",
            detailAction: "विवरण",
            deactivateAction: "निष्क्रिय करें",
            deactivateConfirm: "यह स्थान निष्क्रिय करें? ऐतिहासिक रिकॉर्ड सुरक्षित रहेंगे।",
            noLocationsMatch: "वर्तमान खोज या फ़िल्टर से कोई स्थान नहीं मिलता है।",
            adminLink: "व्यवस्थापक साइन इन", totalComplaints: "कुल शिकायतें",
            pendingComplaints: "लंबित शिकायतें", resolvedComplaints: "सुलझी शिकायतें",
            communityReports: "प्राप्त सामुदायिक रिपोर्ट", awaitingReview: "समीक्षा या कार्रवाई की प्रतीक्षा",
            completedReports: "सुलझी हुई चिह्नित", submitReport: "कचरे की शिकायत दर्ज करें",
            formHelp: "समस्या पहचानने और जाँचने के लिए स्थानीय टीम को पर्याप्त जानकारी दें।",
            citizenName: "आपका नाम", complaintStreet: "सड़क या मोहल्ला",
            categoryLabel: "कचरा समस्या की श्रेणी", chooseCategory: "श्रेणी चुनें",
            catOverflow: "कचरे का ढेर या अतिप्रवाह", catDumping: "अवैध कचरा फेंकना",
            catMissed: "छूटा हुआ संग्रह", catMixed: "मिश्रित या बिना छँटा कचरा",
            catHazardous: "खतरनाक कचरा", catOther: "अन्य",
            descriptionLabel: "विवरण", photoOptional: "फ़ोटो (वैकल्पिक)",
            photoHelp: "JPEG, PNG या WebP; अधिकतम 5 MB।",
            submitComplaint: "शिकायत भेजें", recentReports: "हाल की रिपोर्ट",
            recurringIntro: "दो या अधिक रिपोर्ट वाली सड़कों को बार-बार शिकायत वाली सूची में दिखाया जाता है।",
            dateLabel: "तारीख", statusLabel: "स्थिति",
            noReports: "अभी तक कोई शिकायत दर्ज नहीं हुई।",
            recurringComplaints: "बार-बार शिकायत वाली सड़कें",
            reportsCount: "रिपोर्ट", noRecurring: "अभी किसी सड़क पर कई शिकायतें नहीं हैं।",
            trackHeading: "शिकायत ट्रैक करें",
            trackSubtitle: "रिपोर्ट भेजने के बाद मिला शिकायत ID दर्ज करें।",
            complaintId: "शिकायत ID", trackButton: "स्थिति देखें",
            submittedMessage: "आपकी शिकायत दर्ज हो गई। यह ID सुरक्षित रखें:",
            invalidComplaint: "यह शिकायत ID नहीं मिली। जाँचकर फिर प्रयास करें।",
            trackingDetails: "शिकायत का विवरण", pendingStatus: "लंबित",
            inProgressStatus: "प्रगति में", resolvedStatus: "सुलझी",
            invalidPhoto: "JPEG, PNG या WebP फ़ोटो चुनें।",
            photoTooLarge: "फ़ोटो 5 MB या उससे छोटी होनी चाहिए।",
            requiredFields: "कृपया आवश्यक जानकारी दर्ज करें।",
            adminNav: "व्यवस्थापक प्रबंधन", adminLoginTitle: "व्यवस्थापक साइन इन",
            adminLoginDescription: "इस स्थापना के लिए कॉन्फ़िगर किए गए व्यवस्थापक विवरण से साइन इन करें।",
            adminPageTitle: "शिकायत प्रबंधन",
            adminPageDescription: "नागरिक रिपोर्ट देखें और उनकी स्थिति अपडेट करें।",
            signOut: "साइन आउट", updateStatus: "स्थिति अपडेट करें", saveStatus: "सहेजें",
            analyticsTitle: "विश्लेषण और व्याख्यायोग्य अनुमान",
            analyticsDescription: "उदाहरण कचरा इनपुट और पारदर्शी नियम-आधारित जोखिम अनुमानों की तुलना करें।",
            riskPageTitle: "सड़क-स्तर जोखिम निगरानी",
            riskPageDescription: "उदाहरण स्कोर और सुझाई गई संग्रह कार्रवाइयाँ देखें।",
            collectionPriorities: "संग्रह प्राथमिकताएँ", viewAll: "सभी देखें",
            complaintSnapshot: "शिकायत स्थिति",
            complaintCountsHint: "नागरिक रिपोर्ट की मौजूदा स्थिति की गणना।",
            manageReports: "रिपोर्ट प्रबंधित करें", recentReportsHint: "नागरिकों द्वारा भेजी गई नवीनतम रिपोर्ट।",
            trackNavShort: "रिपोर्ट ट्रैक करें",
            riskDistribution: "सड़क जोखिम वितरण",
            riskDistributionDescription: "पारदर्शी स्कोर श्रेणियों के अनुसार गणना।",
            riskDrivers: "अनुमान कैसे बनता है",
            riskDriversDescription: "हर स्थिति एक निश्चित, जाँच योग्य स्कोर जोड़ती है।",
            wasteRule: "70+ पर 25 अंक, 100+ पर 40 अंक",
            organicRule: "35+ पर 15 अंक, 60+ पर 30 अंक",
            delayRule: "1 दिन पर 15 अंक, 2+ दिनों पर 30 अंक",
            streetEstimates: "सड़क अनुमान",
            estimateExplanation: "स्कोर 100 तक सीमित हैं और कम, मध्यम तथा उच्च प्राथमिकता में बाँटे जाते हैं।",
            ruleEstimate: "नियम-आधारित अनुमान",
            estimateDisclaimerTitle: "अनुमान, पूर्वानुमान नहीं:",
            estimateDisclaimer: "ये काल्पनिक उदाहरण इनपुट से बने नियम-आधारित अनुमान हैं, वास्तविक रुझान, मीथेन माप, प्रशिक्षित AI या भविष्य के उत्सर्जन पूर्वानुमान नहीं।",
            recommendationsTitle: "अगली सुझाई गई कार्रवाइयाँ",
            recommendationsDescription: "सुझाव प्रत्येक सड़क की दर्ज स्थिति पर आधारित हैं।",
            recommendHigh: "संग्रह को प्राथमिकता दें और तुरंत निरीक्षण करें।",
            recommendMedium: "जल्द संग्रह की योजना बनाएं और निगरानी करें।",
            recommendLow: "नियमित संग्रह और निगरानी जारी रखें।",
            interactive: "इंटरैक्टिव",
            mapTitle: "कचरा हॉटस्पॉट मानचित्र",
            mapOverviewSubtitle: "उच्च प्राथमिकता वाले क्षेत्र और उनकी मौजूदा कार्रवाई स्थिति।",
            mapRiskSubtitle: "तत्काल कचरा संग्रह की ज़रूरत वाले क्षेत्र देखें।",
            mapFilterAll: "सभी",
            mapLoading: "कचरा हॉटस्पॉट मानचित्र लोड हो रहा है...",
            mapEmpty: "इस फ़िल्टर से मेल खाने वाला कोई जोखिम क्षेत्र नहीं है।",
            mapTilesUnavailable: "मानचित्र टाइलें उपलब्ध नहीं हैं। सड़क प्राथमिकताएँ नीचे दिखाई गई हैं।",
            mapLibraryUnavailable: "इंटरैक्टिव मानचित्र लोड नहीं हो सका। सड़क प्राथमिकताएँ नीचे दिखाई गई हैं।",
            mapLegendHigh: "उच्च जोखिम", mapLegendMedium: "मध्यम जोखिम", mapLegendLow: "कम जोखिम",
            notificationsTitle: "सूचनाएँ", openNotifications: "सूचनाएँ खोलें",
            markAllRead: "सभी को पढ़ा हुआ चिह्नित करें", noNotifications: "अभी कोई सूचना नहीं है।",
            severityInfo: "जानकारी", severityWarning: "चेतावनी", severityUrgent: "तत्काल",
            username: "उपयोगकर्ता नाम", password: "पासवर्ड", signIn: "साइन इन",
            statusForComplaint: "शिकायत की स्थिति",
            selectLanguage: "भाषा चुनें",
            highRiskNotificationTitle: "उच्च जोखिम वाला क्षेत्र: {zone}",
            highRiskNotificationMessage: "{zone} में जोखिम अधिक है। सुझाई गई कार्रवाई: {action}",
            overdueNotificationTitle: "{zone} में कचरा संग्रह में देरी",
            overdueNotificationMessage: "{zone} में कचरा संग्रह में देरी हुई है। समय-सारणी देखें और संसाधन भेजें।",
            recurringNotificationTitle: "{zone} के पास बार-बार समस्याएँ",
            recurringNotificationMessage: "{zone} के पास बार-बार शिकायतें दर्ज हुई हैं। आगे के संग्रह की योजना बनानी पड़ सकती है।",
            complaintSubmittedTitle: "नागरिक की नई शिकायत मिली",
            complaintSubmittedMessage: "{zone} के लिए नई शिकायत समीक्षा की प्रतीक्षा में है।",
            complaintStatusTitle: "शिकायत की स्थिति अपडेट हुई",
            complaintStatusMessage: "{zone} की शिकायत को अब {status} चिह्नित किया गया है।",
            simulationNotificationTitle: "{zone} का जोखिम परिदृश्य बदला",
            simulationNotificationMessage: "{zone} के लिए सिम्युलेटेड जोखिम में बड़ा बदलाव हुआ है। इस प्राथमिकता की समीक्षा करें।",
            notificationUpdateError: "सूचनाएँ अपडेट नहीं हो सकीं। कृपया फिर प्रयास करें।",
            notificationInvalidId: "इस सूचना की ID मान्य नहीं है।",
            oversizedRequest: "अपलोड किया गया अनुरोध बहुत बड़ा है। फ़ोटो 5 MB या उससे छोटी होनी चाहिए।",
            complaintSaveFailed: "शिकायत सहेजी नहीं जा सकी। कृपया फिर प्रयास करें।",
            adminLoginFailed: "व्यवस्थापक का उपयोगकर्ता नाम या पासवर्ड गलत है।",
            complaintUpdated: "शिकायत की स्थिति अपडेट हुई।",
            nameValidation: "नाम 2 से 100 अक्षरों के बीच होना चाहिए।",
            streetValidation: "सड़क का नाम 2 से 120 अक्षरों के बीच होना चाहिए।",
            categoryValidation: "कृपया कचरा समस्या की मान्य श्रेणी चुनें।",
            descriptionValidation: "विवरण 10 से 2000 अक्षरों के बीच होना चाहिए।",
            photoTypeValidation: "JPEG, PNG या WebP फ़ोटो चुनें।",
            photoSizeValidation: "फ़ोटो 5 MB या उससे छोटी होनी चाहिए।",
            photoMismatch: "अपलोड की गई फ़ाइल समर्थित फ़ोटो प्रकार से मेल नहीं खाती।",
            photoStorageError: "फ़ोटो सहेजी नहीं जा सकी। कृपया फिर प्रयास करें।"
        }
    };

    let currentLanguage = ["en", "ta", "hi"].includes(localStorage.getItem("ecoGuardLanguage"))
        ? localStorage.getItem("ecoGuardLanguage")
        : "en";
    let chart = null;
    let riskChart = null;

    const $ = (id) => document.getElementById(id);

    function t(key) {
        return translations[currentLanguage][key]
            || translations.en[key]
            || key;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[character];
        });
    }

    function riskClass(level) {
        return String(level || "Low").toLowerCase();
    }

    function riskLabel(level) {
        if (level === "High") return t("riskHigh");
        if (level === "Medium") return t("riskMedium");
        return t("riskLow");
    }

    function translateNotifications() {
        const eventKeys = {
            high_risk_zone: ["highRiskNotificationTitle", "highRiskNotificationMessage"],
            collection_overdue: ["overdueNotificationTitle", "overdueNotificationMessage"],
            recurring_complaint: ["recurringNotificationTitle", "recurringNotificationMessage"],
            complaint_submitted: ["complaintSubmittedTitle", "complaintSubmittedMessage"],
            complaint_status_change: ["complaintStatusTitle", "complaintStatusMessage"],
            simulation_risk_change: ["simulationNotificationTitle", "simulationNotificationMessage"]
        };
        const statusKeys = {
            Pending: "pendingStatus",
            "In Progress": "inProgressStatus",
            Resolved: "resolvedStatus"
        };

        document.querySelectorAll(".notification-item[data-event-type]").forEach((item) => {
            const keys = eventKeys[item.dataset.eventType];
            if (!keys) return;

            const values = {
                zone: item.dataset.relatedZone || "",
                action: t("recommendHigh"),
                status: t(statusKeys[item.dataset.notificationStatus] || "statusLabel")
            };
            const title = item.querySelector(".notification-title");
            const message = item.querySelector(".notification-message");
            if (title) {
                title.textContent = t(keys[0]).replace(/\{(\w+)\}/g, (_, key) => values[key] || "");
            }
            if (message) {
                message.textContent = t(keys[1]).replace(/\{(\w+)\}/g, (_, key) => values[key] || "");
            }
        });
    }

    function translateFlashMessages() {
        const exactMessages = {
            "The uploaded request is too large. Photos must be 5 MB or smaller.": "oversizedRequest",
            "The complaint could not be saved. Please try again.": "complaintSaveFailed",
            "Administrator username or password is incorrect.": "adminLoginFailed",
            "Name must be between 2 and 100 characters.": "nameValidation",
            "Street must be between 2 and 120 characters.": "streetValidation",
            "Please select a valid waste problem category.": "categoryValidation",
            "Description must be between 10 and 2000 characters.": "descriptionValidation",
            "Photo must be a JPEG, PNG, or WebP image.": "photoTypeValidation",
            "Photo must be 5 MB or smaller.": "photoSizeValidation",
            "The uploaded file does not match a supported photo type.": "photoMismatch",
            "The photo could not be stored. Please try again.": "photoStorageError",
            "Location name must be between 2 and 120 characters.": "locationNameValidation",
            "Please choose a valid location type.": "locationTypeValidation",
            "Ward or zone is required.": "wardRequiredValidation",
            "Waste, organic content, and collection frequency must be valid numbers.": "locationNumbersValidation",
            "Estimated total waste cannot be negative.": "wasteNegativeValidation",
            "Organic waste percentage must be between 0 and 100.": "organicRangeValidation",
            "Collection frequency must be a positive number of days.": "collectionFrequencyValidation",
            "Latitude and longitude must be numeric values.": "coordinatesNumericValidation",
            "Latitude and longitude must be provided together.": "coordinatesPairValidation",
            "Coordinates are outside the valid Earth range.": "coordinatesRangeValidation",
            "Fill level percentage must be numeric.": "fillNumericValidation",
            "Fill level percentage must be between 0 and 100.": "fillRangeValidation",
            "Segregation efficiency must be numeric.": "segregationNumericValidation",
            "Segregation efficiency must be between 0 and 100.": "segregationRangeValidation",
            "Last collection date must be a valid ISO date or timestamp.": "collectionDateValidation",
            "Notes must be 500 characters or fewer.": "notesLengthValidation",
            "A location with a similar name already exists.": "duplicateLocation",
            "A valid location ID is required to edit a record.": "locationIdRequired",
            "That location could not be found.": "locationNotFound",
            "Location added successfully.": "locationAdded",
            "Location updated successfully.": "locationUpdated",
            "The location could not be deactivated.": "locationDeactivateFailed"
        };
        document.querySelectorAll("[data-flash-message]").forEach((element) => {
            const message = element.dataset.flashMessage || "";
            const key = exactMessages[message]
                || (/^Complaint .+ updated to (Pending|In Progress|Resolved)\.$/.test(message)
                    ? "complaintUpdated"
                    : null);
            if (key) {
                element.textContent = t(key);
                return;
            }

            const deactivatedMatch = message.match(/^(.+) has been deactivated without deleting its historical records\.$/);
            if (deactivatedMatch) {
                element.textContent = t("locationDeactivated").replace("{name}", deactivatedMatch[1]);
            }
        });
    }

    function translateStaticContent() {
        document.documentElement.lang = currentLanguage;

        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            if (translations[currentLanguage][key]) {
                element.textContent = t(key);
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            element.placeholder = t(element.dataset.i18nPlaceholder);
        });
        document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
            element.setAttribute("aria-label", t(element.dataset.i18nAria));
        });
        document.querySelectorAll("[data-i18n-confirm]").forEach((element) => {
            element.dataset.confirmMessage = t(element.dataset.i18nConfirm);
        });
        document.querySelectorAll("[data-i18n-title]").forEach((element) => {
            const translatedTitle = `${t(element.dataset.i18nTitle)} | EcoGuard AI`;
            element.title = translatedTitle;
            if (element.tagName === "TITLE") document.title = translatedTitle;
        });

        const statusKeys = {
            "Pending": "pendingStatus",
            "In Progress": "inProgressStatus",
            "Resolved": "resolvedStatus",
            "Active": "statusActive",
            "Inactive": "statusInactive"
        };
        document.querySelectorAll("[data-status]").forEach((element) => {
            element.textContent = t(statusKeys[element.dataset.status] || "statusLabel");
        });

        const categoryKeys = {
            "Overflowing waste": "catOverflow",
            "Illegal dumping": "catDumping",
            "Missed collection": "catMissed",
            "Mixed or unsorted waste": "catMixed",
            "Hazardous waste": "catHazardous",
            "Other": "catOther"
        };
        document.querySelectorAll("[data-category]").forEach((element) => {
            const key = categoryKeys[element.dataset.category];
            if (key) element.textContent = t(key);
        });

        document.querySelectorAll("[data-risk]").forEach((element) => {
            const key = {
                High: "riskHigh",
                Medium: "riskMedium",
                Low: "riskLow"
            }[element.dataset.risk];
            if (key) element.textContent = t(key);
        });

        translateNotifications();
        translateFlashMessages();
        if ($("delayOutput") && $("delayRange")) {
            $("delayOutput").textContent = $("delayRange").value + " " + t("days");
        }
        renderPriorityList();
        renderTable();
        renderChart();
        renderRiskChart();
        if ($("simStreet")) runSimulation();
    }

    function renderPriorityList() {
        if (!$("priorityList")) return;
        const ranked = [...streets].sort((a, b) => b.risk_score - a.risk_score);
        $("priorityList").innerHTML = ranked.map((street) => `
            <div class="priority-item">
                <div>
                    <div class="priority-name">${escapeHtml(street.street)}</div>
                    <div class="priority-meta">${t("scoreCol")}: ${street.risk_score}/100</div>
                </div>
                <span class="risk-pill ${riskClass(street.risk_level)}">
                    ${escapeHtml(riskLabel(street.risk_level))}
                </span>
            </div>
        `).join("");
    }

    function renderTable() {
        const tableBody = $("streetTableBody");
        if (!tableBody) return;
        const query = ($("streetSearch")?.value || "").trim().toLowerCase();
        const filtered = streets.filter((street) =>
            street.street.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="6">${escapeHtml(t("noResults"))}</td></tr>
            `;
            return;
        }

        tableBody.innerHTML = filtered.map((street) => `
            <tr>
                <td>${escapeHtml(street.street)}</td>
                <td>${street.waste}</td>
                <td>${street.organic}</td>
                <td>${street.delay}</td>
                <td><strong>${street.risk_score}/100</strong></td>
                <td><span class="risk-pill ${riskClass(street.risk_level)}">${escapeHtml(riskLabel(street.risk_level))}</span></td>
            </tr>
        `).join("");
    }

    function renderChart() {
        if (typeof Chart === "undefined" || !$("wasteChart")) return;

        const context = $("wasteChart").getContext("2d");

        if (chart) chart.destroy();

        chart = new Chart(context, {
            type: "bar",
            data: {
                labels: streets.map((street) => street.street),
                datasets: [
                    {
                        label: t("wasteLabel"),
                        data: streets.map((street) => street.waste),
                        backgroundColor: "#237653",
                        borderRadius: 5,
                        maxBarThickness: 35
                    },
                    {
                        label: t("organicLabel"),
                        data: streets.map((street) => street.organic),
                        backgroundColor: "#a9d9b5",
                        borderRadius: 5,
                        maxBarThickness: 35
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 } }
                    },
                    tooltip: { mode: "index", intersect: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 }, maxRotation: 0, minRotation: 0 }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "#edf1ed" },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    }

    function renderRiskChart() {
        if (typeof Chart === "undefined" || !$("riskChart")) return;
        const counts = ["High", "Medium", "Low"].map((level) =>
            streets.filter((street) => street.risk_level === level).length
        );
        const context = $("riskChart").getContext("2d");
        if (riskChart) riskChart.destroy();
        riskChart = new Chart(context, {
            type: "doughnut",
            data: {
                labels: [t("high"), t("medium"), t("low")],
                datasets: [{
                    data: counts,
                    backgroundColor: ["#c43e45", "#d49a28", "#238456"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { usePointStyle: true, boxWidth: 8 }
                    }
                }
            }
        });
    }

    function loadStreetValues() {
        if (!$("simStreet")) return;
        const streetName = $("simStreet").value;
        const street = streets.find((item) => item.street === streetName);

        if (!street) return;

        $("wasteRange").value = street.waste;
        $("organicRange").value = street.organic;
        $("delayRange").value = street.delay;

        syncSliderLabels();
        runSimulation();
    }

    function syncSliderLabels() {
        if (!$("wasteRange") || !$("organicRange") || !$("delayRange")) return;
        const waste = Number($("wasteRange").value);
        const organicRange = $("organicRange");
        const organic = Math.min(Number(organicRange.value), waste);

        organicRange.max = String(Math.max(waste, 1));
        organicRange.value = String(organic);

        $("wasteOutput").textContent = waste;
        $("organicOutput").textContent = organic;
        $("organicMax").textContent = waste;
        $("delayOutput").textContent = $("delayRange").value + " " + t("days");
    }

    function showToast(message) {
        const toast = $("toast");
        toast.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    function renderHotspotMap() {
        const mapElement = $("hotspotMap");
        if (!mapElement) return;

        const loadingState = $("mapLoading");
        const emptyState = $("mapEmptyState");
        const fallbackState = $("mapFallback");
        if (typeof L === "undefined") {
            loadingState?.classList.add("hidden");
            fallbackState?.classList.remove("hidden");
            if (fallbackState) {
                fallbackState.dataset.i18n = "mapLibraryUnavailable";
                fallbackState.textContent = t("mapLibraryUnavailable");
            }
            return;
        }

        const map = L.map(mapElement).setView([13.0827, 80.2707], 12);
        const markerLayer = L.layerGroup().addTo(map);
        const tileLayer = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution: "&copy; OpenStreetMap contributors"
            }
        ).addTo(map);
        const colors = {
            High: "#c43e45",
            Medium: "#d49a28",
            Low: "#238456"
        };
        let activeFilter = "all";

        function renderMarkers() {
            markerLayer.clearLayers();
            const visibleZones = hotspotZones.filter((zone) =>
                activeFilter === "all" || zone.risk_level === activeFilter
            );
            emptyState?.classList.toggle("hidden", visibleZones.length > 0);
            if (emptyState) emptyState.textContent = t("mapEmpty");

            const markerBounds = [];
            visibleZones.forEach((zone) => {
                const latitude = Number(zone.coords?.lat);
                const longitude = Number(zone.coords?.lng);
                if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
                    return;
                }

                const color = colors[zone.risk_level] || colors.Low;
                const marker = L.circleMarker([latitude, longitude], {
                    radius: 10,
                    color,
                    fillColor: color,
                    fillOpacity: 0.78,
                    weight: 2
                });
                marker.bindPopup(() =>
                    `<strong>${escapeHtml(zone.street)}</strong><br>` +
                    `${escapeHtml(riskLabel(zone.risk_level))} · ${zone.risk_score}/100<br>` +
                    `${escapeHtml(t(`recommend${zone.risk_level}`))}`
                );
                marker.addTo(markerLayer);
                markerBounds.push([latitude, longitude]);
            });

            if (markerBounds.length > 1) {
                map.fitBounds(markerBounds, { padding: [24, 24], maxZoom: 14 });
            } else if (markerBounds.length === 1) {
                map.setView(markerBounds[0], 14);
            }
        }

        document.querySelectorAll("[data-zone-filter]").forEach((button) => {
            button.addEventListener("click", () => {
                activeFilter = button.dataset.zoneFilter || "all";
                document.querySelectorAll("[data-zone-filter]").forEach((filter) => {
                    const selected = filter === button;
                    filter.classList.toggle("active", selected);
                    filter.setAttribute("aria-pressed", String(selected));
                });
                renderMarkers();
            });
            button.setAttribute(
                "aria-pressed",
                String(button.dataset.zoneFilter === activeFilter)
            );
        });

        tileLayer.on("tileerror", () => {
            if (fallbackState) {
                fallbackState.dataset.i18n = "mapTilesUnavailable";
                fallbackState.textContent = t("mapTilesUnavailable");
            }
            fallbackState?.classList.remove("hidden");
        });
        tileLayer.on("tileload", () => {
            fallbackState?.classList.add("hidden");
        });

        renderMarkers();
        loadingState?.classList.add("hidden");
        window.requestAnimationFrame(() => map.invalidateSize());
    }

    function setNotificationPanelOpen(open) {
        const panel = $("notificationPanel");
        const bell = $("notificationBell");
        if (!panel || !bell) return;

        panel.hidden = !open;
        bell.setAttribute("aria-expanded", String(open));
    }

    function updateNotificationBadge(unread) {
        const badge = $("notificationBadge");
        if (!badge) return;

        const count = Math.max(0, Number(unread) || 0);
        badge.textContent = String(count);
        badge.style.display = count > 0 ? "inline-flex" : "none";
    }

    async function postNotificationAction(url) {
        const response = await fetch(url, { method: "POST" });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || t("notificationUpdateError"));
        }
        if (!result.success) {
            throw new Error(t("notificationUpdateError"));
        }
        return result;
    }

    async function runSimulation() {
        if (!$("simStreet") || !$("comparisonText")) return;
        syncSliderLabels();

        const payload = {
            street: $("simStreet").value,
            waste: Number($("wasteRange").value),
            organic: Number($("organicRange").value),
            delay: Number($("delayRange").value)
        };

        $("comparisonText").textContent = t("loading");

        try {
            const response = await fetch("/api/simulate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || t("simulationError"));
            }

            $("simScore").textContent = result.risk_score;

            const pill = $("simRiskPill");
            pill.className = "risk-pill " + riskClass(result.risk_level);
            pill.textContent = riskLabel(result.risk_level);

            const meter = $("meterFill");
            meter.style.width = result.risk_score + "%";
            meter.style.background =
                result.risk_level === "High" ? "#c43e45" :
                result.risk_level === "Medium" ? "#d49a28" : "#238456";

            if (result.original_score === null) {
                $("comparisonText").textContent = t("originalNotFound");
            } else {
                const difference = result.risk_score - result.original_score;

                let comparison;
                if (difference > 0) {
                    comparison = `${t("increased")} ${difference} ${t("points")}.`;
                } else if (difference < 0) {
                    comparison = `${t("decreased")} ${Math.abs(difference)} ${t("points")}.`;
                } else {
                    comparison = t("noChange");
                }

                $("comparisonText").textContent =
                    `${t("originalScore")}: ${result.original_score}/100 · ` +
                    `${t("scenarioScore")}: ${result.risk_score}/100. ${comparison}`;
            }

            $("recommendations").innerHTML = result.recommendations.map((item) =>
                `<li>${escapeHtml(item)}</li>`
            ).join("");

        } catch (error) {
            $("comparisonText").textContent = error.message || t("simulationError");
            $("recommendations").innerHTML = "";
        }
    }

    function exportCsv() {
        const headers = [
            "Street", "Waste units", "Organic waste units",
            "Collection delay days", "Risk score", "Risk level"
        ];

        const rows = streets.map((street) => [
            street.street, street.waste, street.organic,
            street.delay, street.risk_score, street.risk_level
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((value) =>
                '"' + String(value).replace(/"/g, '""') + '"'
            ).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ecoguard-street-report.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);

        showToast(t("csvDownloaded"));
    }

    $("languageSelect").value = currentLanguage;
    $("languageSelect").addEventListener("change", (event) => {
        currentLanguage = event.target.value;
        localStorage.setItem("ecoGuardLanguage", currentLanguage);
        translateStaticContent();
    });
    translateStaticContent();

    const complaintForm = $("complaintForm");
    if (complaintForm) {
        const textFields = [
            ["citizenName", 2],
            ["complaintStreet", 2],
            ["complaintDescription", 10]
        ];
        const photoInput = $("complaintPhoto");
        const allowedPhotos = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp"
        };

        photoInput.addEventListener("change", () => {
            const file = photoInput.files[0];
            photoInput.setCustomValidity("");
            if (!file) return;
            const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
            if (!Object.prototype.hasOwnProperty.call(allowedPhotos, extension)) {
                photoInput.setCustomValidity(t("invalidPhoto"));
            } else if (file.type !== allowedPhotos[extension]) {
                photoInput.setCustomValidity(t("invalidPhoto"));
            } else if (file.size > 5 * 1024 * 1024) {
                photoInput.setCustomValidity(t("photoTooLarge"));
            }
        });

        complaintForm.addEventListener("submit", (event) => {
            textFields.forEach(([id, minimum]) => {
                const field = $(id);
                field.setCustomValidity(
                    field.value.trim().length < minimum ? t("requiredFields") : ""
                );
            });
            if (!complaintForm.reportValidity()) event.preventDefault();
        });
    }

    if ($("streetSearch")) $("streetSearch").addEventListener("input", renderTable);
    if ($("exportCsv")) $("exportCsv").addEventListener("click", exportCsv);
    if ($("simStreet")) $("simStreet").addEventListener("change", loadStreetValues);

    ["wasteRange", "organicRange", "delayRange"].forEach((id) => {
        const input = $(id);
        if (input) input.addEventListener("input", () => {
            syncSliderLabels();
            runSimulation();
        });
    });

    if ($("resetSimulator")) {
        $("resetSimulator").addEventListener("click", loadStreetValues);
    }

    const notificationBell = $("notificationBell");
    const notificationPanel = $("notificationPanel");
    if (notificationBell && notificationPanel) {
        notificationBell.setAttribute("aria-expanded", "false");
        notificationBell.addEventListener("click", (event) => {
            event.stopPropagation();
            setNotificationPanelOpen(notificationPanel.hidden);
        });
        notificationPanel.addEventListener("click", (event) => {
            event.stopPropagation();
        });
        document.addEventListener("click", (event) => {
            if (!event.target.closest(".notification-wrap")) {
                setNotificationPanelOpen(false);
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") setNotificationPanelOpen(false);
        });
    }

    const markAllReadButton = $("markAllRead");
    if (markAllReadButton) {
        markAllReadButton.addEventListener("click", async () => {
            markAllReadButton.disabled = true;
            try {
                await postNotificationAction("/api/notifications/read-all");
                document.querySelectorAll(".notification-item.unread").forEach((item) => {
                    item.classList.replace("unread", "read");
                });
                updateNotificationBadge(0);
            } catch (error) {
                showToast(error.message || t("notificationUpdateError"));
            } finally {
                markAllReadButton.disabled = false;
            }
        });
    }

    document.querySelectorAll(".notification-item.unread").forEach((item) => {
        item.addEventListener("click", async () => {
            const notificationId = item.dataset.notificationId;
            if (!notificationId) {
                showToast(t("notificationInvalidId"));
                return;
            }
            item.disabled = true;
            try {
                await postNotificationAction(
                    `/api/notifications/${encodeURIComponent(notificationId)}/read`
                );
                item.classList.replace("unread", "read");
                const currentUnread = Number($("notificationBadge")?.textContent || 0);
                updateNotificationBadge(currentUnread - 1);
            } catch (error) {
                showToast(error.message || t("notificationUpdateError"));
            } finally {
                item.disabled = false;
            }
        });
    });

    renderPriorityList();
    renderTable();
    renderChart();
    renderRiskChart();
    renderHotspotMap();
    if ($("simStreet")) loadStreetValues();
