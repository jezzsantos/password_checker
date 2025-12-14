import tkinter as tk
from tkinter import ttk
import re


class PasswordStrengthTester:
    def __init__(self, root):
        self.root = root
        self.root.title("Password Strength Tester")
        self.root.geometry("500x400")
        self.root.resizable(False, False)

        # Configure colors
        self.strength_colors = {
            'Very Weak': '#d32f2f',
            'Weak': '#f57c00',
            'Medium': '#fbc02d',
            'Strong': '#689f38',
            'Very Strong': '#388e3c'
        }

        self.setup_ui()

    def setup_ui(self):
        # Title
        title_label = tk.Label(
            self.root,
            text="Password Strength Tester",
            font=("Arial", 20, "bold"),
            pady=20
        )
        title_label.pack()

        # Password input frame
        input_frame = tk.Frame(self.root, pady=10)
        input_frame.pack(fill="x", padx=20)

        tk.Label(input_frame, text="Enter Password:",
                 font=("Arial", 12)).pack(anchor="w")

        self.password_var = tk.StringVar()
        self.password_var.trace('w', self.on_password_change)

        self.password_entry = tk.Entry(
            input_frame,
            textvariable=self.password_var,
            font=("Arial", 12),
            show="*",
            width=40
        )
        self.password_entry.pack(fill="x", pady=5)

        # Show/Hide password checkbox
        self.show_password_var = tk.BooleanVar()
        show_checkbox = tk.Checkbutton(
            input_frame,
            text="Show Password",
            variable=self.show_password_var,
            command=self.toggle_password_visibility
        )
        show_checkbox.pack(anchor="w")

        # Strength indicator
        strength_frame = tk.Frame(self.root, pady=10)
        strength_frame.pack(fill="x", padx=20)

        tk.Label(strength_frame, text="Strength:", font=(
            "Arial", 12, "bold")).pack(anchor="w")

        self.strength_label = tk.Label(
            strength_frame,
            text="Very Weak",
            font=("Arial", 14, "bold"),
            fg=self.strength_colors['Very Weak']
        )
        self.strength_label.pack(anchor="w", pady=5)

        # Progress bar
        self.progress = ttk.Progressbar(
            strength_frame,
            length=400,
            mode='determinate'
        )
        self.progress.pack(fill="x", pady=5)

        # Criteria checklist
        criteria_frame = tk.Frame(self.root, pady=10)
        criteria_frame.pack(fill="x", padx=20)

        tk.Label(criteria_frame, text="Password Requirements:",
                 font=("Arial", 12, "bold")).pack(anchor="w")

        self.criteria_labels = {}
        criteria = [
            ("length", "At least 8 characters"),
            ("uppercase", "Contains uppercase letter"),
            ("lowercase", "Contains lowercase letter"),
            ("number", "Contains number"),
            ("special", "Contains special character")
        ]

        for key, text in criteria:
            label = tk.Label(
                criteria_frame,
                text=f"✗ {text}",
                font=("Arial", 10),
                fg="red",
                anchor="w"
            )
            label.pack(anchor="w", pady=2)
            self.criteria_labels[key] = label

    def toggle_password_visibility(self):
        if self.show_password_var.get():
            self.password_entry.config(show="")
        else:
            self.password_entry.config(show="*")

    def on_password_change(self, *args):
        password = self.password_var.get()
        strength, score, criteria_met = self.check_password_strength(password)
        self.update_ui(strength, score, criteria_met)

    def check_password_strength(self, password):
        score = 0
        criteria_met = {
            'length': False,
            'uppercase': False,
            'lowercase': False,
            'number': False,
            'special': False
        }

        if len(password) == 0:
            return 'Very Weak', 0, criteria_met

        # Check length
        if len(password) >= 8:
            score += 20
            criteria_met['length'] = True
        if len(password) >= 12:
            score += 10
        if len(password) >= 16:
            score += 10

        # Check for uppercase
        if re.search(r'[A-Z]', password):
            score += 15
            criteria_met['uppercase'] = True

        # Check for lowercase
        if re.search(r'[a-z]', password):
            score += 15
            criteria_met['lowercase'] = True

        # Check for numbers
        if re.search(r'\d', password):
            score += 15
            criteria_met['number'] = True

        # Check for special characters
        if re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', password):
            score += 15
            criteria_met['special'] = True

        # Determine strength level
        if score < 30:
            strength = 'Very Weak'
        elif score < 50:
            strength = 'Weak'
        elif score < 70:
            strength = 'Medium'
        elif score < 85:
            strength = 'Strong'
        else:
            strength = 'Very Strong'

        return strength, score, criteria_met

    def update_ui(self, strength, score, criteria_met):
        # Update strength label
        self.strength_label.config(
            text=strength, fg=self.strength_colors[strength])

        # Update progress bar
        self.progress['value'] = score

        # Update criteria labels
        for key, label in self.criteria_labels.items():
            if criteria_met[key]:
                text = label.cget("text").replace("✗", "✓")
                label.config(text=text, fg="green")
            else:
                text = label.cget("text")
                if "✓" in text:
                    text = text.replace("✓", "✗")
                label.config(text=text, fg="red")


def main():
    root = tk.Tk()
    app = PasswordStrengthTester(root)
    root.mainloop()


if __name__ == "__main__":
    main()
