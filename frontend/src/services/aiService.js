class MedicalAIService {
  constructor() {
    this.conversationHistory = [];
    this.knowledgeBase = {
      specialties: [
        'Cardiology', 'Neurology', 'Dermatology', 'Pediatrics', 
        'Orthopedics', 'Oncology', 'Gynecology', 'Psychiatry',
        'Ophthalmology', 'ENT', 'Dentistry', 'General Medicine'
      ],
      commonSymptoms: {
        'headache': ['Neurology', 'General Medicine'],
        'chest pain': ['Cardiology', 'General Medicine'],
        'skin rash': ['Dermatology'],
        'child fever': ['Pediatrics'],
        'joint pain': ['Orthopedics', 'Rheumatology'],
        'eye problem': ['Ophthalmology'],
        'ear pain': ['ENT'],
        'toothache': ['Dentistry'],
        'cough': ['Pulmonology', 'General Medicine'],
        'stomach pain': ['Gastroenterology', 'General Medicine']
      },
      emergencyKeywords: ['emergency', 'urgent', 'immediate', 'severe pain', 'accident', 'unconscious']
    };
  }

  async processQuery(userInput, userContext = {}) {
    console.log('AI Service processing query:', { userInput, userContext });
    
    try {
      const input = userInput.toLowerCase().trim();
      this.conversationHistory.push({ role: 'user', content: userInput, timestamp: new Date() });

      // Check for emergency situations
      if (this.isEmergency(input)) {
        console.log('Handling emergency query');
        return this.handleEmergency();
      }

      // Check for appointment-related queries
      if (this.isAppointmentQuery(input)) {
        console.log('Handling appointment query');
        return this.handleAppointmentQuery(input, userContext);
      }

      // Check for doctor search queries
      if (this.isDoctorSearchQuery(input)) {
        console.log('Handling doctor search query');
        return this.handleDoctorSearch(input);
      }

      // Check for symptom-related queries
      if (this.isSymptomQuery(input)) {
        console.log('Handling symptom query');
        return this.handleSymptomQuery(input);
      }

      // General conversation fallback
      console.log('Handling general query');
      return this.handleGeneralQuery(input);
    } catch (error) {
      console.error('AI Service error:', error);
      throw error;
    }
  }

  isEmergency(input) {
    return this.knowledgeBase.emergencyKeywords.some(keyword => 
      input.includes(keyword)
    );
  }

  isAppointmentQuery(input) {
    const appointmentKeywords = ['book', 'appointment', 'schedule', 'reserve', 'cancel', 'reschedule'];
    return appointmentKeywords.some(keyword => input.includes(keyword));
  }

  isDoctorSearchQuery(input) {
    const searchKeywords = ['find doctor', 'search doctor', 'look for', 'doctor near me', 'specialist'];
    return searchKeywords.some(keyword => input.includes(keyword));
  }

  isSymptomQuery(input) {
    const symptomKeywords = ['pain', 'ache', 'hurt', 'sore', 'fever', 'cough', 'rash', 'symptom'];
    return symptomKeywords.some(keyword => input.includes(keyword)) || 
           Object.keys(this.knowledgeBase.commonSymptoms).some(symptom => input.includes(symptom));
  }

  handleEmergency() {
    const response = {
      response: "🚨 MEDICAL EMERGENCY DETECTED 🚨\n\nThis appears to be a medical emergency. Please take the following immediate actions:\n\n1. Call your local emergency services (911 or local emergency number)\n2. If conscious, have the person lie down and stay calm\n3. If available, gather any relevant medical information\n\n⚠️ I am an AI assistant and cannot provide emergency medical care. Professional medical help is needed immediately.",
      type: 'emergency',
      priority: 'high',
      suggestedActions: [
        'Call 911 or emergency services',
        'Stay calm and get medical attention',
        'Gather medical information if available'
      ]
    };
    
    this.conversationHistory.push({ 
      role: 'assistant', 
      content: response.response, 
      type: 'emergency',
      timestamp: new Date() 
    });
    
    return response;
  }

  handleAppointmentQuery(input, userContext) {
    let response = '';
    let suggestedActions = [];

    if (input.includes('book') || input.includes('schedule')) {
      response = "I'd be happy to help you book an appointment. To proceed:\n\n1. Tell me what specialty of doctor you need\n2. When would you prefer the appointment?\n3. Any specific symptoms or concerns you'd like to mention?";
      
      suggestedActions = [
        'Find doctors by specialty',
        'Show available time slots',
        'View appointment calendar'
      ];
    } else if (input.includes('cancel') || input.includes('reschedule')) {
      response = "To manage your appointments:\n\n1. Go to 'My Appointments' in your profile\n2. Select the appointment you want to cancel or reschedule\n3. Choose 'Cancel Appointment' or pick a new date/time\n\nNeed me to navigate there for you?";
      
      suggestedActions = [
        'Go to appointment page',
        'Cancel appointment',
        'Reschedule appointment'
      ];
    } else {
      response = "You can manage appointments in your 'My Appointments' section. You can book, view, cancel, or reschedule appointments from there.\n\nWhat specific appointment action do you need help with?";
    }

    const responseObject = {
      response,
      type: 'appointment',
      context: userContext,
      suggestedActions
    };
    
    this.conversationHistory.push({ 
      role: 'assistant', 
      content: response, 
      type: 'appointment',
      timestamp: new Date() 
    });
    
    return responseObject;
  }

  handleDoctorSearch(input) {
    let response = '';
    let suggestedActions = [];
    
    // Extract specialty from input
    const foundSpecialty = this.knowledgeBase.specialties.find(specialty => 
      input.includes(specialty.toLowerCase())
    );
    
    if (foundSpecialty) {
      response = `I found doctors specializing in ${foundSpecialty}! You can:\n\n1. View all ${foundSpecialty} specialists\n2. Check their availability and ratings\n3. Book an appointment directly\n\nWould you like me to show you the ${foundSpecialty} doctors?`;
      
      suggestedActions = [
        `Find ${foundSpecialty} doctors`,
        'View doctor profiles',
        'Book appointment'
      ];
    } else {
      response = "I can help you find doctors by specialty. We have specialists in:\n\n" + 
                this.knowledgeBase.specialties.slice(0, 8).join(', ') + 
                "\n\nWhat type of medical care are you looking for?";
      
      suggestedActions = [
        'Browse all specialties',
        'Search by symptoms',
        'Find nearest doctors'
      ];
    }

    const responseObject = {
      response,
      type: 'doctor_search',
      specialty: foundSpecialty,
      suggestedActions
    };
    
    this.conversationHistory.push({ 
      role: 'assistant', 
      content: response, 
      type: 'doctor_search',
      timestamp: new Date() 
    });
    
    return responseObject;
  }

  handleSymptomQuery(input) {
    let response = '';
    let suggestedActions = [];
    
    // Check for common symptoms
    const matchedSymptoms = Object.keys(this.knowledgeBase.commonSymptoms)
      .filter(symptom => input.includes(symptom));
    
    if (matchedSymptoms.length > 0) {
      const symptom = matchedSymptoms[0];
      const specialties = this.knowledgeBase.commonSymptoms[symptom];
      
      response = `Based on "${symptom}", I recommend consulting:\n\n${specialties.map(s => `• ${s} Specialist`).join('\n')}\n\nThese specialists can properly evaluate and treat your symptoms. Would you like me to help you find available doctors in these specialties?`;
      
      suggestedActions = [
        `Find ${specialties[0]} doctors`,
        'Book consultation',
        'Learn more about symptoms'
      ];
    } else {
      response = "I'd like to help with your symptoms. Could you describe:\n\n1. What specific symptoms you're experiencing\n2. How long you've had them\n3. Any other related concerns\n\nThis will help me recommend the right type of doctor for you.";
      
      suggestedActions = [
        'Describe symptoms in detail',
        'Find general practitioners',
        'Emergency assessment'
      ];
    }

    const responseObject = {
      response,
      type: 'symptom_assessment',
      matchedSymptoms,
      suggestedActions
    };
    
    this.conversationHistory.push({ 
      role: 'assistant', 
      content: response, 
      type: 'symptom_assessment',
      timestamp: new Date() 
    });
    
    return responseObject;
  }

  handleGeneralQuery(input) {
    const responses = [
      "I'm here to help with your medical needs. You can ask me about:\n\n• Finding doctors by specialty\n• Booking appointments\n• Managing your appointments\n• Symptom guidance\n\nWhat would you like assistance with?",
      
      "I can help you navigate your healthcare journey. Whether you need to find a specialist, book an appointment, or manage your medical care, I'm here to assist.\n\nWhat medical service do you need today?",
      
      "As your medical AI assistant, I can help you:\n\n✓ Find the right doctor for your needs\n✓ Schedule and manage appointments\n✓ Get guidance on symptoms\n✓ Navigate medical services\n\nHow can I help you with your healthcare today?"
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    const suggestedActions = [
      'Find doctors',
      'Book appointment',
      'Manage appointments',
      'Symptom check'
    ];

    const responseObject = {
      response,
      type: 'general',
      suggestedActions
    };
    
    this.conversationHistory.push({ 
      role: 'assistant', 
      content: response, 
      type: 'general',
      timestamp: new Date() 
    });
    
    return responseObject;
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearConversation() {
    this.conversationHistory = [
      {
        role: 'assistant', 
        content: 'Hello! I\'m your medical assistant. How can I help you today?',
        timestamp: new Date()
      }
    ];
  }

  getSuggestedQuickActions() {
    return [
      { text: 'Find cardiologists', query: 'Find cardiologists near me' },
      { text: 'Book appointment', query: 'Book appointment for checkup' },
      { text: 'Check appointments', query: 'Check my upcoming appointments' },
      { text: 'Symptom help', query: 'I have a headache, what should I do?' },
      { text: 'Emergency help', query: 'Medical emergency assistance' }
    ];
  }
}

// Export singleton instance
export default new MedicalAIService();