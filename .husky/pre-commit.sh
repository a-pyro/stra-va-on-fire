npx lint-staged ||
(
        echo '😤🏀👋😤 Whoops! Your code needs some adjustments! 😤🏀👋😤 
                ESLint Check Failed. Make the required changes listed above, add changes and try to commit again.'
        false; 
)