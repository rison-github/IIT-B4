document.addEventListener('DOMContentLoaded',
                            function(event)
                                {
                                    function submitForm(event)
                                        {
                                            event.preventDefault();
                                            const amount = document.getElementById('amount').value;
                                            const category = document.getElementById('category').value;
                                            const date = document.getElementById('date').value;
                                            const formData = 
                                                {
                                                    amount: amount,
                                                    category: category,
                                                    date: date
                                                };
                                            fetch('/index',
                                                {
                                                    method: 'POST',
                                                    headers:
                                                        {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify(formData),
                                                })
                                                .then(response => response.json())
                                                .then(data =>
                                                    {
                                                        console.log(data);
                                                    });
                                        }
                                        document.getElementById('expensesList').addEventListener('addExpense()', submitForm);
                                });