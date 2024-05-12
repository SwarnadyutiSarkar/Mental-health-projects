import SwiftUI
import AVFoundation

// View model for the meditation timer
class MeditationTimerViewModel: ObservableObject {
    @Published var timerIsRunning = false
    @Published var timeRemaining = 300 // Initial time: 5 minutes
    @Published var selectedSound = "Bell" // Default sound
    
    var player: AVAudioPlayer?
    
    let meditationSounds = ["Bell", "Ocean", "Forest"]
    
    func toggleTimer() {
        timerIsRunning.toggle()
        if timerIsRunning {
            startTimer()
        } else {
            stopTimer()
        }
    }
    
    func startTimer() {
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if self.timeRemaining > 0 {
                self.timeRemaining -= 1
            } else {
                self.stopTimer()
            }
        }
    }
    
    func stopTimer() {
        timerIsRunning = false
        timeRemaining = 300 // Reset time to 5 minutes
        playSound()
    }
    
    func playSound() {
        if let soundURL = Bundle.main.url(forResource: selectedSound, withExtension: "mp3") {
            do {
                player = try AVAudioPlayer(contentsOf: soundURL)
                player?.play()
            } catch {
                print("Error playing sound: \(error.localizedDescription)")
            }
        }
    }
}

// Main view
struct ContentView: View {
    @StateObject var viewModel = MeditationTimerViewModel()
    
    var body: some View {
        VStack {
            Text("\(viewModel.timeRemaining / 60):\(String(format: "%02d", viewModel.timeRemaining % 60))")
                .font(.largeTitle)
                .padding()
            
            Button(action: {
                viewModel.toggleTimer()
            }) {
                Text(viewModel.timerIsRunning ? "Pause" : "Start")
                    .font(.title)
                    .padding()
                    .foregroundColor(.white)
                    .background(Color.blue)
                    .cornerRadius(10)
            }
            .padding()
            
            Picker(selection: $viewModel.selectedSound, label: Text("Select Sound")) {
                ForEach(viewModel.meditationSounds, id: \.self) { sound in
                    Text(sound).tag(sound)
                }
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
